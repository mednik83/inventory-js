import db from "../database/db.js";
import { Operation } from "../types.js";

class OperationRepository {
  create(operation: Pick<Operation, "equipment_id" | "type" | "comment">) {
    if (!operation.comment) {
      return db
        .prepare(
          `
        INSERT INTO operations (equipment_id, type)
        VALUES (?, ?)
        `,
        )
        .run(operation.equipment_id, operation.type);
    }
    return db
      .prepare(
        `
      INSERT INTO operations (equipment_id, type, comment)
      VALUES (?, ?, ?)
      `,
      )
      .run(operation.equipment_id, operation.type, operation.comment);
  }

  getByEquipmentId(equipmentId: number): Operation[] {
    return db
      .prepare(
        `
      SELECT * FROM operations
      WHERE equipment_id = ?
      ORDER BY created_at DESC, id DESC
      `,
      )
      .all(equipmentId) as Operation[];
  }

  deleteByEquipmentId(equipmentId: number) {
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
