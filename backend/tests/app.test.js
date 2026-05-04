import request from "supertest";
import assert from "node:assert/strict";
import { app } from "../app.js";

const testEquipment = {
  name: "Printer",
  status: "active",
};

let firstRoomId;
let secondRoomId;

before(async () => {
  const roomsRes = await request(app)
    .get("/rooms")
    .expect("Content-Type", /json/)
    .expect(200);

  assert.ok(Array.isArray(roomsRes.body), "Rooms response must be an array");
  assert.ok(
    roomsRes.body.length > 0,
    "Rooms table must contain at least one room",
  );

  firstRoomId = roomsRes.body[0].id;
  secondRoomId = roomsRes.body[1]?.id ?? roomsRes.body[0].id;
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
  it("should create, get, put and delete equipment by id", async () => {
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

    await request(app).delete(`/equipments/${id}`).expect(204);

    await request(app).get(`/equipments/${id}`).expect(404);
  });
});
