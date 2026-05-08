import db from "../database/db.js";

class OperationRepository {
  create(equipmentId, type, comment = null) {
    if (!comment) {
      return db
        .prepare(
          `
        INSERT INTO operations (equipment_id, type)
        VALUES (?, ?)
        `,
        )
        .run(equipmentId, type);
    }
    return db
      .prepare(
        `
      INSERT INTO operations (equipment_id, type, comment)
      VALUES (?, ?, ?)
      `,
      )
      .run(equipmentId, type, comment);
  }

  getByEquipmentId(equipmentId) {
    return db
      .prepare(
        `
      SELECT * FROM operations
      WHERE equipment_id = ?
      `,
      )
      .all(equipmentId);
  }

  deleteByEquipmentId(equipmentId) {
    return db
      .prepare(
        `
      DELETE FROM operations
      WHERE equipment_id = ?
      `,
      )
      .run(equipmentId);
  }
}

export const operationRepository = new OperationRepository();
