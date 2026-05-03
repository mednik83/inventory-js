import request from "supertest";
import assert from "node:assert/strict";
import { app } from "../app.js";

const testEquipment = {
  name: "Printer",
  room: "1",
  status: "active",
};

describe("GET /equipments", () => {
  it("should return equipments as json", async () => {
    const res = await request(app)
      .get("/equipments")
      .expect("Content-Type", /json/)
      .expect(200);

    if (!Array.isArray(res.body)) {
      throw new Error("Expected array of equipments");
    }
  });
});

describe("POST /equipments", () => {
  it("should return new equipment as json", async () => {
    const res = await request(app)
      .post("/equipments")
      .send({
        name: "Printer",
        room: "1",
        status: "active",
      })
      .expect("Content-Type", /json/)
      .expect(201)
      .expect((response) => {
        assert.strictEqual(response.body.name, testEquipment.name);
        assert.strictEqual(response.body.room, testEquipment.room);
        assert.strictEqual(response.body.status, testEquipment.status);
      });
  });

  it("should return 400 if data is missing", async () => {
    await request(app)
      .post("/equipments")
      .send({
        room: "1",
        status: "active",
      })
      .expect(400);
  });
});

describe("Delete /equipments/:id", () => {
  it("should return 404", async () => {
    await request(app).delete("/equipments/9999999999").expect(404);
  });
});

describe("equipment flow", () => {
  it("should create, get, put and delete equipment by id", async () => {
    const createRes = await request(app)
      .post("/equipments")
      .send({
        name: testEquipment.name,
        room: testEquipment.room,
        status: testEquipment.status,
      })
      .expect("Content-Type", /json/)
      .expect(201);

    const createdEquipment = createRes.body;
    const id = createdEquipment.id;

    assert.ok(id);
    assert.strictEqual(createdEquipment.name, testEquipment.name);
    assert.strictEqual(createdEquipment.room, testEquipment.room);
    assert.strictEqual(createdEquipment.status, testEquipment.status);

    const getRes = await request(app)
      .get(`/equipments/${id}`)
      .expect("Content-Type", /json/)
      .expect(200);

    assert.strictEqual(getRes.body.id, id);
    assert.strictEqual(getRes.body.name, testEquipment.name);

    const putEquipment = {
      name: "updated",
      room: "2",
      status: "inactive",
    };

    const putRes = await request(app)
      .put(`/equipments/${id}`)
      .send(putEquipment)
      .expect("Content-Type", /json/)
      .expect(200);

    assert.strictEqual(putRes.body.id, id);
    assert.strictEqual(putRes.body.name, putEquipment.name);
    assert.strictEqual(putRes.body.room, putEquipment.room);
    assert.strictEqual(putRes.body.status, putEquipment.status);

    await request(app).delete(`/equipments/${id}`).expect(204);

    await request(app).get(`/equipments/${id}`).expect(404);
  });
});
