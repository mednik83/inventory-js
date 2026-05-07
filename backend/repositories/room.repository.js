import db from "../database/db.js";

class RoomRepository {
  findAll(limit = 0) {
    if (limit > 0) {
      return db
        .prepare(
          `
        SELECT * FROM rooms
        LIMIT ?
        `,
        )
        .all(limit);
    }
    return db
      .prepare(
        `
    SELECT * FROM rooms
    `,
      )
      .all();
  }

  findById(id) {
    return db
      .prepare(
        `
      SELECT * FROM rooms
      WHERE id = ?
      `,
      )
      .get(id);
  }

  create(room) {
    const result = db
      .prepare(
        `
      INSERT INTO rooms (name)
      VALUES (?)
      `,
      )
      .run(room.name);
    return this.findById(result.lastInsertRowid);
  }

  update(room) {
    return db
      .prepare(
        `
      UPDATE rooms
      SET name = ?
      WHERE id = ?
      `,
      )
      .run(room.name, room.id);
  }

  deleteById(id) {
    return db
      .prepare(
        `
      DELETE FROM rooms
      WHERE id = ?
      `,
      )
      .run(id);
  }
}

export const roomRepository = new RoomRepository();
