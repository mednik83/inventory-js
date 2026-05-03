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
}

export const roomRepository = new RoomRepository();
