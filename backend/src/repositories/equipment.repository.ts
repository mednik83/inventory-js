import type {
  Equipment,
  EquipmentFilters,
  EquipmentWithRoom,
} from "../types.ts";
import db from "../database/db.js";

class EquipmentRepository {
  create(equipment: Omit<Equipment, "id">): EquipmentWithRoom | undefined {
    const result = db
      .prepare(
        `
      INSERT INTO equipments (uuid, name, room_id, status)
      VALUES (?, ?, ?, ?)
    `,
      )
      .run(equipment.uuid, equipment.name, equipment.room_id, equipment.status);

    return this.findById(Number(result.lastInsertRowid));
  }

  findByUuid(uuid: string): EquipmentWithRoom | undefined {
    return db
      .prepare(
        `
      SELECT
        equipments.id,
        equipments.uuid,
        equipments.name,
        equipments.room_id,
        rooms.name AS room_name,
        equipments.status
      FROM equipments
      JOIN rooms ON rooms.id = equipments.room_id
      WHERE equipments.uuid = ?
      `,
      )
      .get(uuid) as EquipmentWithRoom | undefined;
  }

  findById(id: number): EquipmentWithRoom | undefined {
    return db
      .prepare(
        `
      SELECT
        equipments.id,
        equipments.uuid,
        equipments.name,
        equipments.room_id,
        rooms.name AS room_name,
        equipments.status
      FROM equipments
      JOIN rooms ON rooms.id = equipments.room_id
      WHERE equipments.id = ?
      `,
      )
      .get(id) as EquipmentWithRoom | undefined;
  }

  findAll(filters: EquipmentFilters = {}): EquipmentWithRoom[] {
    let sql = `
      SELECT
        equipments.id,
        equipments.uuid,
        equipments.name,
        equipments.room_id,
        rooms.name AS room_name,
        equipments.status
      FROM equipments
      JOIN rooms ON rooms.id = equipments.room_id
    `;

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (filters.roomIds?.length) {
      const placeholders = filters.roomIds.map(() => "?").join(", ");
      conditions.push(`room_id IN (${placeholders})`);
      params.push(...filters.roomIds);
    }

    if (filters.status) {
      conditions.push("status = ?");
      params.push(filters.status);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    if (filters.limit) {
      sql += " LIMIT ?";
      params.push(filters.limit);
    }

    return db.prepare(sql).all(...params) as EquipmentWithRoom[];
  }

  update(equipment: Omit<Equipment, "uuid">): number {
    const result = db
      .prepare(
        `
      UPDATE equipments
      SET name = ?, room_id = ?, status = ?
      WHERE id = ?
      `,
      )
      .run(equipment.name, equipment.room_id, equipment.status, equipment.id);

    return result.changes;
  }

  updateRoom(id: number, roomId: number): number {
    const result = db
      .prepare(
        `
        UPDATE equipments
        SET room_id = ?
        WHERE id = ?
      `,
      )
      .run(roomId, id);

    return result.changes;
  }

  countByRoomId(roomId: number): number {
    const row = db
      .prepare(`SELECT COUNT(*) AS count FROM equipments WHERE room_id = ?`)
      .get(roomId) as { count: number };

    return row.count;
  }

  deleteById(id: number): number {
    return db
      .prepare(
        `
      DELETE FROM equipments
      WHERE id = ?
      `,
      )
      .run(id).changes;
  }
}

export const equipmentRepository = new EquipmentRepository();
