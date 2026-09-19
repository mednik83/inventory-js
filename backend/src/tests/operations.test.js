import request from "supertest";
import assert from "node:assert/strict";
import { app } from "../app.js";
import db from "../database/db.js";

describe("Operations API", () => {
  beforeEach(() => {
    db.prepare("DELETE FROM operations").run();
    db.prepare("DELETE FROM equipments").run();
    db.prepare("DELETE FROM rooms").run();
  });

  describe("Operations API", () => {
    const testRoom = {
      name: "room 101",
    };
    const testEquipment = {
      name: "Monitor",
      status: "active",
    };
    describe("GET /operations", () => {
      it("should return operations as json array", async () => {
        const resRoom = await request(app)
          .post("/rooms")
          .send({
            name: testRoom.name,
          })
          .expect("Content-Type", /json/)
          .expect(201);

        const resEquipment = await request(app)
          .post("/equipments")
          .send({
            name: testEquipment.name,
            room_id: resRoom.body.id,
            status: testEquipment.status,
          })
          .expect("Content-Type", /json/)
          .expect(201);

        await request(app)
          .put(`/equipments/${resEquipment.body.id}`)
          .send({
            ...resEquipment.body,
            name: "LG Monitor",
          })
          .expect(200);

        await request(app)
          .post(`/equipments/${resEquipment.body.id}/write-off`)
          .expect(200);

        const resOperations = await request(app)
          .get(`/operations?equipment_id=${resEquipment.body.id}`)
          .expect(200)
          .expect("Content-Type", /json/);

        assert.ok(
          Array.isArray(resOperations.body),
          "Expected array of operations",
        );
      });
      it("should return 400 when operations without equipment_id", async () => {
        const resRoom1 = await request(app)
          .post("/rooms")
          .send({
            name: testRoom.name,
          })
          .expect("Content-Type", /json/)
          .expect(201);

        await request(app)
          .post("/equipments")
          .send({
            name: testEquipment.name,
            room_id: resRoom1.body.id,
            status: testEquipment.status,
          })
          .expect("Content-Type", /json/)
          .expect(201);

        const resOperations1 = await request(app)
          .get(`/operations?equipment_id=abc`)
          .expect(400);
      });
      it("should return with equipment_id as json array", async () => {
        const resRoom1 = await request(app)
          .post("/rooms")
          .send({
            name: testRoom.name,
          })
          .expect("Content-Type", /json/)
          .expect(201);

        const resRoom2 = await request(app)
          .post("/rooms")
          .send({
            name: "Room 102",
          })
          .expect("Content-Type", /json/)
          .expect(201);

        await request(app)
          .post("/equipments")
          .send({
            name: testEquipment.name,
            room_id: resRoom2.body.id,
            status: testEquipment.status,
          })
          .expect("Content-Type", /json/)
          .expect(201);

        await request(app)
          .post("/equipments")
          .send({
            name: testEquipment.name,
            room_id: resRoom2.body.id,
            status: testEquipment.status,
          })
          .expect("Content-Type", /json/)
          .expect(201);

        const resEquipment = await request(app)
          .post("/equipments")
          .send({
            name: testEquipment.name,
            room_id: resRoom2.body.id,
            status: testEquipment.status,
          })
          .expect("Content-Type", /json/)
          .expect(201);

        await request(app)
          .put(`/equipments/${resEquipment.body.id}`)
          .send({
            ...resEquipment.body,
            name: "LG Monitor",
          })
          .expect(200);

        await request(app)
          .post(`/equipments/${resEquipment.body.id}/write-off`)
          .expect(200);

        const resOperations1 = await request(app)
          .get(`/operations?equipment_id=${resEquipment.body.id}`)
          .expect(200)
          .expect("Content-Type", /json/);

        assert.ok(
          Array.isArray(resOperations1.body),
          "Expected array of operations",
        );
      });
      describe("Move operations", () => {
        it("should return moved operations with equipment id", async () => {
          const room = await request(app)
            .post("/rooms")
            .set("Content-Type", "application/json")
            .send({ name: "Room 204" })
            .expect(201);

          const newRoom = await request(app)
            .post("/rooms")
            .set("Content-Type", "application/json")
            .send({ name: "Room 504" })
            .expect(201);

          const eq = await request(app)
            .post(`/equipments`)
            .set("Content-Type", "application/json")
            .send({
              name: testEquipment.name,
              room_id: room.body.id,
              status: testEquipment.status,
            })
            .expect(201);

          await request(app)
            .post(`/equipments/${eq.body.id}/move`)
            .set("Content-Type", "application/json")
            .send({
              room_id: newRoom.body.id,
            })
            .expect(200);

          const operations = await request(app)
            .get(`/operations?equipment_id=${eq.body.id}`)
            .expect(200);

          const moveOperation = operations.body.find(
            (op) => op.type === "move",
          );

          assert.ok(moveOperation, "Expected a move operation in history");
          assert.match(moveOperation.comment, /Room 204/);
          assert.match(moveOperation.comment, /Room 504/);
        });
        it("should return [] moved operations with no exists equipment id", async () => {
          const operations = await request(app)
            .get(`/operations?equipment_id=999999`)
            .expect(200);

          assert.ok(
            Array.isArray(operations.body),
            "Expected array of operations",
          );

          assert.strictEqual(0, operations.body.length);
        });
      });
    });
  });
});
