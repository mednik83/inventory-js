import request from "supertest";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { app } from "../app.js";
import db from "../database/db.js";

describe("Equipment UUID and QR API", () => {
  let roomId;
  let equipmentId;
  let equipmentUuid;

  beforeEach(async () => {
    db.prepare("DELETE FROM operations").run();
    db.prepare("DELETE FROM equipments").run();
    db.prepare("DELETE FROM rooms").run();

    const roomRes = await request(app)
      .post("/rooms")
      .send({ name: "Room 101" })
      .expect("Content-Type", /json/)
      .expect(201);

    roomId = roomRes.body.id;

    const equipmentRes = await request(app)
      .post("/equipments")
      .send({
        name: "Printer",
        room_id: roomId,
        status: "active",
      })
      .expect("Content-Type", /json/)
      .expect(201);

    equipmentId = equipmentRes.body.id;
    equipmentUuid = equipmentRes.body.uuid;

    assert.ok(roomId, "Expected created room id");
    assert.ok(equipmentId, "Expected created equipment id");
    assert.ok(equipmentUuid, "Expected created equipment uuid");
  });

  describe("GET /equipments/uuid/:uuid", () => {
    it("should return equipment by uuid", async () => {
      const res = await request(app)
        .get(`/equipments/uuid/${equipmentUuid}`)
        .expect("Content-Type", /json/)
        .expect(200);

      assert.strictEqual(res.body.id, equipmentId);
      assert.strictEqual(res.body.uuid, equipmentUuid);
      assert.strictEqual(res.body.name, "Printer");
      assert.strictEqual(res.body.room_id, roomId);
      assert.strictEqual(res.body.status, "active");
    });

    it("should return 400 for invalid uuid", async () => {
      await request(app)
        .get("/equipments/uuid/not-a-valid-uuid")
        .expect("Content-Type", /json/)
        .expect(400);
    });

    it("should return 404 for valid but non-existing uuid", async () => {
      await request(app)
        .get(`/equipments/uuid/${randomUUID()}`)
        .expect("Content-Type", /json/)
        .expect(404);
    });
  });

  describe("GET /equipments/uuid/:uuid/qr", () => {
    it("should return qr code as svg", async () => {
      const res = await request(app)
        .get(`/equipments/uuid/${equipmentUuid}/qr`)
        .expect("Content-Type", /image\/svg\+xml/)
        .expect(200);

      const svg = res.body.toString();

      assert.ok(svg.length > 0, "Expected non-empty svg response");
      assert.match(svg, /<svg/i);
      assert.match(svg, /<\/svg>/i);
    });

    it("should return 400 for invalid uuid in qr route", async () => {
      await request(app)
        .get("/equipments/uuid/not-a-valid-uuid/qr")
        .expect("Content-Type", /json/)
        .expect(400);
    });

    it("should return 404 for valid but non-existing uuid in qr route", async () => {
      await request(app)
        .get(`/equipments/uuid/${randomUUID()}/qr`)
        .expect("Content-Type", /json/)
        .expect(404);
    });
  });
});
