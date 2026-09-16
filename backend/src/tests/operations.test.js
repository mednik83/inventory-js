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

        assert.ok(Array.isArray(resOperations.body), "Expected array of rooms");
      });
      it("should return with limit and room_id operations as json array", async () => {
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
          .get(
            `/operations?equipment_id=${resEquipment.body.id}&limit=2&room_id=${resRoom1.body.id}`,
          )
          .expect(200)
          .expect("Content-Type", /json/);

        assert.ok(
          Array.isArray(resOperations1.body),
          "Expected array of rooms",
        );

        const resOperations2 = await request(app)
          .get(
            `/operations?equipment_id=${resEquipment.body.id}&limit=2&room_id=${resRoom1.body.id}`,
          )
          .expect(200)
          .expect("Content-Type", /json/);
      });
    });
  });
});
