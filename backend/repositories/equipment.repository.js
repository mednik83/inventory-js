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

  findAll(filters = {}) {
    let sql = `
      SELECT * FROM equipments
    `;
    const conditions = [];
    const params = [];

    if (filters.roomIds) {
      const placeholders = filters.roomIds.map(() => "?").join(", ");
      conditions.push(`room_id IN (${placeholders})`);
      params.push(...filters.roomIds);
    }

    if (filters.status) {
      conditions.push("status = ?");
      params.push(filters.status);
    }

    if (conditions.length > 0) {
      sql += "WHERE " + conditions.join(" AND ");
    }

    if (filters.limit) {
      sql += " LIMIT ?";
      params.push(filters.limit);
    }

    return db.prepare(sql).all(...params);
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

  countByRoomId(roomId) {
    return db
      .prepare(
        `
      SELECT * FROM equipments
      WHERE room_id = ?`,
      )
      .all(roomId);
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
