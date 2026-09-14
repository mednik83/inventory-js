import request from "supertest";
import assert from "node:assert/strict";
import { app } from "../app.js";
import db from "../database/db.js";

describe("Equipment API", () => {
  let firstRoomId;
  let secondRoomId;

  beforeEach(async () => {
    db.prepare("DELETE FROM operations").run();
    db.prepare("DELETE FROM equipments").run();
    db.prepare("DELETE FROM rooms").run();

    const firstRoomRes = await request(app)
      .post("/rooms")
      .send({ name: "Room 101" })
      .expect("Content-Type", /json/)
      .expect(201);

    firstRoomId = firstRoomRes.body.id;

    const secondRoomRes = await request(app)
      .post("/rooms")
      .send({ name: "Room 102" })
      .expect("Content-Type", /json/)
      .expect(201);

    secondRoomId = secondRoomRes.body.id;
  });

  const makeEquipment = (overrides = {}) => ({
    name: "Printer",
    room_id: firstRoomId,
    status: "active",
    ...overrides,
  });

  const testEquipment = {
    name: "Printer",
    status: "active",
  };

  before(async () => {
    const res = await request(app)
      .get("/rooms")
      .expect("Content-Type", /json/)
      .expect(200);

    assert.ok(Array.isArray(res.body), "Rooms response must be an array");
  });

  describe("GET /equipments", () => {
    it("should return equipments as json", async () => {
      const res = await request(app)
        .get("/equipments")
        .expect("Content-Type", /json/)
        .expect(200);

      assert.ok(Array.isArray(res.body), "Expected array of equipments");
    });
  });

  describe("POST /equipments", () => {
    it("should return new equipment as json", async () => {
      await request(app)
        .post("/equipments")
        .send({
          name: testEquipment.name,
          room_id: firstRoomId,
          status: testEquipment.status,
        })
        .expect("Content-Type", /json/)
        .expect(201)
        .expect((response) => {
          assert.ok(response.body.id, "Expected created equipment id");
          assert.strictEqual(response.body.name, testEquipment.name);
          assert.strictEqual(response.body.room_id, firstRoomId);
          assert.strictEqual(response.body.status, testEquipment.status);
        });
    });

    it("should return 400 if data is missing", async () => {
      await request(app)
        .post("/equipments")
        .send({
          room_id: firstRoomId,
          status: "active",
        })
        .expect("Content-Type", /json/)
        .expect(400);
    });

    it("should return 400 if name is too short", async () => {
      await request(app)
        .post("/equipments")
        .send({
          name: "A",
          room_id: firstRoomId,
          status: "active",
        })
        .expect("Content-Type", /json/)
        .expect(400);
    });

    it("should return 400 if status is invalid", async () => {
      await request(app)
        .post("/equipments")
        .send({
          name: "Printer",
          room_id: firstRoomId,
          status: "banana",
        })
        .expect("Content-Type", /json/)
        .expect(400);
    });

    it("should return 404 if room does not exist", async () => {
      await request(app)
        .post("/equipments")
        .send({
          name: "Printer",
          room_id: 999999999,
          status: "active",
        })
        .expect("Content-Type", /json/)
        .expect(404);
    });
  });

  describe("GET /equipments/:id", () => {
    it("should return equipment by id", async () => {
      const createRes = await request(app)
        .post("/equipments")
        .send({
          name: "Laptop",
          room_id: firstRoomId,
          status: "active",
        })
        .expect(201);

      const id = createRes.body.id;

      const getRes = await request(app)
        .get(`/equipments/${id}`)
        .expect("Content-Type", /json/)
        .expect(200);

      assert.strictEqual(getRes.body.id, id);
      assert.strictEqual(getRes.body.name, "Laptop");
      assert.strictEqual(getRes.body.room_id, firstRoomId);
      assert.strictEqual(getRes.body.status, "active");
    });

    it("should return 400 for invalid id", async () => {
      await request(app)
        .get("/equipments/abc")
        .expect("Content-Type", /json/)
        .expect(400);
    });

    it("should return 404 if equipment does not exist", async () => {
      await request(app)
        .get("/equipments/9999999999")
        .expect("Content-Type", /json/)
        .expect(404);
    });
  });

  describe("PUT /equipments/:id", () => {
    it("should update equipment and return updated json", async () => {
      const createRes = await request(app)
        .post("/equipments")
        .send({
          name: "Monitor",
          room_id: firstRoomId,
          status: "active",
        })
        .expect(201);

      const id = createRes.body.id;

      const putEquipment = {
        name: "updated",
        room_id: secondRoomId,
        status: "inactive",
      };

      const putRes = await request(app)
        .put(`/equipments/${id}`)
        .send(putEquipment)
        .expect("Content-Type", /json/)
        .expect(200);

      assert.strictEqual(putRes.body.id, id);
      assert.strictEqual(putRes.body.name, putEquipment.name);
      assert.strictEqual(putRes.body.room_id, putEquipment.room_id);
      assert.strictEqual(putRes.body.status, putEquipment.status);
    });

    it("should return 400 for invalid status on update", async () => {
      const createRes = await request(app)
        .post("/equipments")
        .send({
          name: "Keyboard",
          room_id: firstRoomId,
          status: "active",
        })
        .expect(201);

      const id = createRes.body.id;

      await request(app)
        .put(`/equipments/${id}`)
        .send({
          name: "Keyboard updated",
          room_id: firstRoomId,
          status: "wrong_status",
        })
        .expect("Content-Type", /json/)
        .expect(400);
    });

    it("should return 404 if equipment does not exist", async () => {
      await request(app)
        .put("/equipments/9999999999")
        .send({
          name: "Ghost",
          room_id: firstRoomId,
          status: "active",
        })
        .expect("Content-Type", /json/)
        .expect(404);
    });

    it("should return 404 if room does not exist on update", async () => {
      const createRes = await request(app)
        .post("/equipments")
        .send({
          name: "Mouse",
          room_id: firstRoomId,
          status: "active",
        })
        .expect(201);

      const id = createRes.body.id;

      await request(app)
        .put(`/equipments/${id}`)
        .send({
          name: "Mouse updated",
          room_id: 999999999,
          status: "active",
        })
        .expect("Content-Type", /json/)
        .expect(404);
    });
  });

  describe("DELETE /equipments/:id", () => {
    it("should delete equipment and return 204", async () => {
      const createRes = await request(app)
        .post("/equipments")
        .send({
          name: "Scanner",
          room_id: firstRoomId,
          status: "active",
        })
        .expect(201);

      const id = createRes.body.id;

      await request(app).delete(`/equipments/${id}`).expect(204);

      await request(app).get(`/equipments/${id}`).expect(404);
    });

    it("should return 400 for invalid id on delete", async () => {
      await request(app)
        .delete("/equipments/abc")
        .expect("Content-Type", /json/)
        .expect(400);
    });

    it("should return 404 if equipment does not exist on delete", async () => {
      await request(app)
        .delete("/equipments/9999999999")
        .expect("Content-Type", /json/)
        .expect(404);
    });
  });

  describe("equipment flow", () => {
    it("should create, get, put and delete (write_off and force delete) equipment by id", async () => {
      const createRes = await request(app)
        .post("/equipments")
        .send({
          name: testEquipment.name,
          room_id: firstRoomId,
          status: testEquipment.status,
        })
        .expect("Content-Type", /json/)
        .expect(201);

      const createdEquipment = createRes.body;
      const id = createdEquipment.id;

      assert.ok(id);
      assert.strictEqual(createdEquipment.name, testEquipment.name);
      assert.strictEqual(createdEquipment.room_id, firstRoomId);
      assert.strictEqual(createdEquipment.status, testEquipment.status);

      const getRes = await request(app)
        .get(`/equipments/${id}`)
        .expect("Content-Type", /json/)
        .expect(200);

      assert.strictEqual(getRes.body.id, id);
      assert.strictEqual(getRes.body.name, testEquipment.name);
      assert.strictEqual(getRes.body.room_id, firstRoomId);
      assert.strictEqual(getRes.body.status, testEquipment.status);

      await request(app).post(`/equipments/${id}/write-off`).expect(200);

      const afterRes = await request(app).get(`/equipments/${id}`).expect(200);

      assert.strictEqual(afterRes.body.id, id);
      assert.strictEqual(afterRes.body.name, testEquipment.name);
      assert.strictEqual(afterRes.body.room_id, firstRoomId);
      assert.strictEqual(afterRes.body.status, "written_off");

      await request(app).post(`/equipments/asd/write-off`).expect(400);

      await request(app)
        .post(`/equipments/${id + 9999}/write-off`)
        .expect(404);

      await request(app).delete(`/equipments/${id}`).expect(204);

      await request(app).get(`/equipments/${id}`).expect(404);
    });
  });

  describe("POST /equipments/:id/write-off", () => {
    it("should write off equipment and return updated equipment", async () => {
      const createRes = await request(app)
        .post("/equipments")
        .send({
          name: testEquipment.name,
          room_id: firstRoomId,
          status: testEquipment.status,
        })
        .expect("Content-Type", /json/)
        .expect(201);

      const createdEquipment = createRes.body;
      const id = createdEquipment.id;

      const afterRes = await request(app)
        .post(`/equipments/${id}/write-off`)
        .expect(200);

      assert.strictEqual(afterRes.body.id, id);
      assert.strictEqual(afterRes.body.name, testEquipment.name);
      assert.strictEqual(afterRes.body.room_id, firstRoomId);
      assert.strictEqual(afterRes.body.status, "written_off");
    });

    it("should return 409 when equipment is already written off", async () => {
      const createRes = await request(app)
        .post("/equipments")
        .send({
          name: testEquipment.name,
          room_id: firstRoomId,
          status: testEquipment.status,
        })
        .expect("Content-Type", /json/)
        .expect(201);

      const createdEquipment = createRes.body;
      const id = createdEquipment.id;

      await request(app).post(`/equipments/${id}/write-off`).expect(200);
      const resFalseWritteOff = await request(app)
        .post(`/equipments/${id}/write-off`)
        .expect(409);
      const resBodyMessage = resFalseWritteOff.body.message;
      assert.strictEqual(
        resBodyMessage,
        "The equipment has already been written off.",
      );
    });
    it("should return 400 for invalid id on write-off", async () => {
      await request(app).post(`/equipments/abc/write-off`).expect(400);
    });
    it("should return 404 if equipment does not exist on write-off", async () => {
      await request(app).post(`/equipments/99999/write-off`).expect(404);
    });
  });

  describe("logs, filter, spaces", () => {
    it("should log create operation", async () => {
      const { body: eq } = await request(app)
        .post("/equipments")
        .send(makeEquipment())
        .expect(201);

      const { body: operations } = await request(app)
        .get(`/operations?equipment_id=${eq.id}`)
        .expect(200);

      assert.strictEqual(operations.length, 1);
      assert.strictEqual(operations[0].type, "create");
    });
    it("should filter equipments by status", async () => {
      await request(app)
        .post("/equipments")
        .send(makeEquipment({ name: "Active one" }))
        .expect(201);
      await request(app)
        .post("/equipments")
        .send(makeEquipment({ name: "Inactive one", status: "inactive" }))
        .expect(201);

      const { body } = await request(app)
        .get("/equipments?status=active")
        .expect(200);

      assert.strictEqual(body.length, 1);
      assert.strictEqual(body[0].name, "Active one");
    });
    it("should return 400 if name contains only spaces", async () => {
      await request(app)
        .post("/equipments")
        .send(makeEquipment({ name: "   " }))
        .expect(400);
    });
  });

  describe("delete equipment before room", () => {
    it("should return 409 when room has equipment", async () => {
      await request(app).post("/equipments").send({
        name: testEquipment.name,
        room_id: firstRoomId,
        status: testEquipment.status,
      });

      await request(app).delete(`/rooms/${firstRoomId}`).expect(409);
    });
  });
});
