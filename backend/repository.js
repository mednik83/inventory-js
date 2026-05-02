import db from "./db.js";

class EquipmentRepository {
  create(equipment) {
    db.prepare(
      `
      INSERT INTO equipments (id, name, room, status)
      VALUES (?, ?, ?, ?)
    `,
    ).run(equipment.id, equipment.name, equipment.room, equipment.status);

    return equipment;
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
      SET name = ?, room = ?, status = ?
      WHERE id = ?
      `,
      )
      .run(equipment.name, equipment.room, equipment.status, equipment.id);

    if (result.changes === 0) {
      throw new Error("Equipment not found");
    }

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
