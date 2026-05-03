import db from "../database/db.js";

class EquipmentRepository {
  create(equipment) {
    const result = db
      .prepare(
        `
      INSERT INTO equipments (name, room_id, status)
      VALUES (?, ?, ?)
    `,
      )
      .run(equipment.name, equipment.room_id, equipment.status);

    return this.findById(result.lastInsertRowid);
  }

  findById(id) {
    return db
      .prepare(
        `
      SELECT * FROM equipments
      WHERE id = ?
      `,
      )
      .get(id);
  }

  findAll(limit = 0) {
    if (limit > 0) {
      return db
        .prepare(
          `
        SELECT * FROM equipments
        LIMIT ?
        `,
        )
        .all(limit);
    }
    return db
      .prepare(
        `
        SELECT * FROM equipments
        `,
      )
      .all();
  }

  update(equipment) {
    const result = db
      .prepare(
        `
      UPDATE equipments
      SET name = ?, room_id = ?, status = ?
      WHERE id = ?
      `,
      )
      .run(equipment.name, equipment.room_id, equipment.status, equipment.id);

    return result;
  }

  deleteById(id) {
    return db
      .prepare(
        `
      DELETE FROM equipments
      WHERE id = ?
      `,
      )
      .run(id);
  }
}

export const equipmentRepository = new EquipmentRepository();
