import type {
  Equipment,
  EquipmentFilters,
  EquipmentWithRoom,
} from "../types.ts";
import db from "../database/db.js";

/* eslint-disable @typescript-eslint/require-await -- до P5: тела синхронные (better-sqlite3) */
class EquipmentRepository {
  async create(
    equipment: Omit<Equipment, "id">,
  ): Promise<EquipmentWithRoom | undefined> {
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

  async findByUuid(uuid: string): Promise<EquipmentWithRoom | undefined> {
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

  async findById(id: number): Promise<EquipmentWithRoom | undefined> {
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

  async findAll(filters: EquipmentFilters = {}): Promise<EquipmentWithRoom[]> {
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

  async update(equipment: Omit<Equipment, "uuid">): Promise<number> {
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

  async updateRoom(id: number, roomId: number): Promise<number> {
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

  async countByRoomId(roomId: number): Promise<number> {
    const row = db
      .prepare(`SELECT COUNT(*) AS count FROM equipments WHERE room_id = ?`)
      .get(roomId) as { count: number };

    return row.count;
  }

  async deleteById(id: number): Promise<number> {
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
