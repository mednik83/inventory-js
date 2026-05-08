import request from "supertest";
import assert from "node:assert/strict";
import { app } from "../app.js";
import db from "../database/db.js";

describe("Room API", () => {
  beforeEach(() => {
    db.prepare("DELETE FROM operations").run();
    db.prepare("DELETE FROM equipments").run();
    db.prepare("DELETE FROM rooms").run();
  });

  describe("Room API", () => {
    describe("GET /rooms", () => {
      it("should return rooms as json array", async () => {
        const res = await request(app)
          .get("/rooms")
          .expect("Content-Type", /json/)
          .expect(200);

        assert.ok(Array.isArray(res.body), "Expected array of rooms");
      });

      it("should return empty array if there are no rooms", async () => {
        const res = await request(app)
          .get("/rooms")
          .expect("Content-Type", /json/)
          .expect(200);

        assert.deepStrictEqual(res.body, []);
      });
    });

    describe("POST /rooms", () => {
      it("should create new room and return it as json", async () => {
        const payload = { name: "Room 101" };

        const res = await request(app)
          .post("/rooms")
          .send(payload)
          .expect("Content-Type", /json/)
          .expect(201);

        assert.ok(res.body.id, "Expected created room id");
        assert.strictEqual(res.body.name, payload.name);
      });

      it("should return 400 if room data is missing", async () => {
        await request(app)
          .post("/rooms")
          .send({})
          .expect("Content-Type", /json/)
          .expect(400);
      });

      it("should return 400 if room name is empty", async () => {
        await request(app)
          .post("/rooms")
          .send({ name: "" })
          .expect("Content-Type", /json/)
          .expect(400);
      });

      it("should return 400 if room name contains only spaces", async () => {
        await request(app)
          .post("/rooms")
          .send({ name: "   " })
          .expect("Content-Type", /json/)
          .expect(400);
      });

      it("should return 400 if room name is too short", async () => {
        await request(app)
          .post("/rooms")
          .send({ name: "A" })
          .expect("Content-Type", /json/)
          .expect(400);
      });

      // Включай этот тест, только если у тебя реально реализован конфликт дубликатов через 409
      // it("should return 409 if room already exists", async () => {
      //   await request(app)
      //     .post("/rooms")
      //     .send({ name: "Room 101" })
      //     .expect(201);
      //
      //   await request(app)
      //     .post("/rooms")
      //     .send({ name: "Room 101" })
      //     .expect("Content-Type", /json/)
      //     .expect(409);
      // });
    });

    describe("GET /rooms/:id", () => {
      it("should return room by id", async () => {
        const createRes = await request(app)
          .post("/rooms")
          .send({ name: "Room 101" })
          .expect(201);

        const id = createRes.body.id;

        const getRes = await request(app)
          .get(`/rooms/${id}`)
          .expect("Content-Type", /json/)
          .expect(200);

        assert.strictEqual(getRes.body.id, id);
        assert.strictEqual(getRes.body.name, "Room 101");
      });

      it("should return 400 for invalid id", async () => {
        await request(app)
          .get("/rooms/abc")
          .expect("Content-Type", /json/)
          .expect(400);
      });

      it("should return 404 if room does not exist", async () => {
        await request(app)
          .get("/rooms/9999999999")
          .expect("Content-Type", /json/)
          .expect(404);
      });
    });

    describe("PUT /rooms/:id", () => {
      it("should update room and return updated json", async () => {
        const createRes = await request(app)
          .post("/rooms")
          .send({ name: "Room 101" })
          .expect(201);

        const id = createRes.body.id;

        const updateRes = await request(app)
          .put(`/rooms/${id}`)
          .send({ name: "Room 202" })
          .expect("Content-Type", /json/)
          .expect(200);

        assert.strictEqual(updateRes.body.id, id);
        assert.strictEqual(updateRes.body.name, "Room 202");
      });

      it("should return 400 for invalid id on update", async () => {
        await request(app)
          .put("/rooms/abc")
          .send({ name: "Room 202" })
          .expect("Content-Type", /json/)
          .expect(400);
      });

      it("should return 400 if update data is missing", async () => {
        const createRes = await request(app)
          .post("/rooms")
          .send({ name: "Room 101" })
          .expect(201);

        const id = createRes.body.id;

        await request(app)
          .put(`/rooms/${id}`)
          .send({})
          .expect("Content-Type", /json/)
          .expect(400);
      });

      it("should return 400 if updated room name is too short", async () => {
        const createRes = await request(app)
          .post("/rooms")
          .send({ name: "Room 101" })
          .expect(201);

        const id = createRes.body.id;

        await request(app)
          .put(`/rooms/${id}`)
          .send({ name: "A" })
          .expect("Content-Type", /json/)
          .expect(400);
      });

      it("should return 404 if room does not exist on update", async () => {
        await request(app)
          .put("/rooms/9999999999")
          .send({ name: "Ghost room" })
          .expect("Content-Type", /json/)
          .expect(404);
      });

      // Включай, если реализовал 409 на дубликаты
      // it("should return 409 if updated room name already exists", async () => {
      //   const firstRoomRes = await request(app)
      //     .post("/rooms")
      //     .send({ name: "Room 101" })
      //     .expect(201);
      //
      //   await request(app)
      //     .post("/rooms")
      //     .send({ name: "Room 202" })
      //     .expect(201);
      //
      //   await request(app)
      //     .put(`/rooms/${firstRoomRes.body.id}`)
      //     .send({ name: "Room 202" })
      //     .expect("Content-Type", /json/)
      //     .expect(409);
      // });
    });

    describe("DELETE /rooms/:id", () => {
      it("should delete room and return 204", async () => {
        const createRes = await request(app)
          .post("/rooms")
          .send({ name: "Room 101" })
          .expect(201);

        const id = createRes.body.id;

        await request(app).delete(`/rooms/${id}`).expect(204);

        await request(app).get(`/rooms/${id}`).expect(404);
      });

      it("should return 400 for invalid id on delete", async () => {
        await request(app)
          .delete("/rooms/abc")
          .expect("Content-Type", /json/)
          .expect(400);
      });

      it("should return 404 if room does not exist on delete", async () => {
        await request(app)
          .delete("/rooms/9999999999")
          .expect("Content-Type", /json/)
          .expect(404);
      });

      // Включай, если у тебя удаление комнаты запрещено, когда на неё ссылается equipment
      // it("should return 409 if room is used by equipment", async () => {
      //   const roomRes = await request(app)
      //     .post("/rooms")
      //     .send({ name: "Room 101" })
      //     .expect(201);
      //
      //   await request(app)
      //     .post("/equipments")
      //     .send({
      //       name: "Printer",
      //       room_id: roomRes.body.id,
      //       status: "active",
      //     })
      //     .expect(201);
      //
      //   await request(app)
      //     .delete(`/rooms/${roomRes.body.id}`)
      //     .expect("Content-Type", /json/)
      //     .expect(409);
      // });
    });

    describe("room flow", () => {
      it("should create, get, update and delete room by id", async () => {
        const createRes = await request(app)
          .post("/rooms")
          .send({ name: "Room 101" })
          .expect("Content-Type", /json/)
          .expect(201);

        const createdRoom = createRes.body;
        const id = createdRoom.id;

        assert.ok(id);
        assert.strictEqual(createdRoom.name, "Room 101");

        const getRes = await request(app)
          .get(`/rooms/${id}`)
          .expect("Content-Type", /json/)
          .expect(200);

        assert.strictEqual(getRes.body.id, id);
        assert.strictEqual(getRes.body.name, "Room 101");

        const updateRes = await request(app)
          .put(`/rooms/${id}`)
          .send({ name: "Room 202" })
          .expect("Content-Type", /json/)
          .expect(200);

        assert.strictEqual(updateRes.body.id, id);
        assert.strictEqual(updateRes.body.name, "Room 202");

        await request(app).delete(`/rooms/${id}`).expect(204);

        await request(app).get(`/rooms/${id}`).expect(404);
      });
    });
  });
});
