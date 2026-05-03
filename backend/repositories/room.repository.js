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
}

export const roomRepository = new RoomRepository();
