import db from "../database/db.js";
import { Room } from "../types.js";

class RoomRepository {
  findAll(limit: number = 0): Room[] {
    if (limit > 0) {
      return db
        .prepare(
          `
        SELECT * FROM rooms
        LIMIT ?
        `,
        )
        .all(limit) as Room[];
    }
    return db
      .prepare(
        `
    SELECT * FROM rooms
    `,
      )
      .all() as Room[];
  }

  findByName(name: string) {
    return db
      .prepare(
        `
      SELECT * FROM rooms
      WHERE name = ?
      `,
      )
      .get(name);
  }

  findById(id: number): Room | undefined {
    return db
      .prepare(
        `
      SELECT * FROM rooms
      WHERE id = ?
      `,
      )
      .get(id) as Room | undefined;
  }

  create(room: Omit<Room, "id">) {
    const result = db
      .prepare(
        `
      INSERT INTO rooms (name)
      VALUES (?)
      `,
      )
      .run(room.name);
    return this.findById(Number(result.lastInsertRowid));
  }

  update(room: Room) {
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

  deleteById(id: number) {
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
