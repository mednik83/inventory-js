import type {
  Equipment,
  EquipmentFilters,
  EquipmentWithRoom,
} from "../types.ts";
import { prisma } from "../database/prisma.js";

class EquipmentRepository {
  async create(
    equipment: Omit<Equipment, "id">,
  ): Promise<EquipmentWithRoom | null> {
    const result = await prisma.equipment.create({ data: equipment });

    return this.findById(Number(result.id));
  }

  async findByUuid(uuid: string): Promise<EquipmentWithRoom | null> {
    const rows = await prisma.equipment.findUnique({
      select: {
        id: true,
        name: true,
        uuid: true,
        room_id: true,
        status: true,
        room: { select: { name: true } },
      },
      where: {
        uuid,
      },
    });

    if (!rows) {
      return null;
    }

    const result: EquipmentWithRoom = {
      id: rows.id,
      name: rows.name,
      uuid: rows.uuid,
      room_id: rows.room_id,
      status: rows.status,
      room_name: rows.room.name,
    };

    return result;
  }

  async findById(id: number): Promise<EquipmentWithRoom | null> {
    const rows = await prisma.equipment.findUnique({
      where: { id: id },
      include: { room: { select: { name: true } } },
    });

    if (!rows) {
      return null;
    }

    const result: EquipmentWithRoom = {
      id: rows.id,
      name: rows.name,
      uuid: rows.uuid,
      room_id: rows.room_id,
      status: rows.status,
      room_name: rows.room.name,
    };

    return result;
  }

  async findAll(filters: EquipmentFilters = {}): Promise<EquipmentWithRoom[]> {
    const rows = await prisma.equipment.findMany({
      where: {
        room_id: { in: filters.roomIds },
        status: filters.status,
      },
      take: filters.limit,
      include: { room: { select: { name: true } } },
      orderBy: { id: "asc" },
    });

    const result: EquipmentWithRoom[] = rows.map((row) => {
      return {
        id: row.id,
        name: row.name,
        uuid: row.uuid,
        room_id: row.room_id,
        status: row.status,
        room_name: row.room.name,
      };
    });

    return result;
  }

  async update(equipment: Omit<Equipment, "uuid">): Promise<EquipmentWithRoom> {
    const rows = await prisma.equipment.update({
      where: { id: equipment.id },
      data: {
        name: equipment.name,
        room_id: equipment.room_id,
        status: equipment.status,
      },
      include: { room: { select: { name: true } } },
    });

    const result: EquipmentWithRoom = {
      id: rows.id,
      name: rows.name,
      uuid: rows.uuid,
      room_id: rows.room_id,
      status: rows.status,
      room_name: rows.room.name,
    };

    return result;
  }

  async updateRoom(id: number, roomId: number): Promise<EquipmentWithRoom> {
    const rows = await prisma.equipment.update({
      where: { id: id },
      data: {
        room_id: roomId,
      },
      include: { room: { select: { name: true } } },
    });

    const result: EquipmentWithRoom = {
      id: rows.id,
      name: rows.name,
      uuid: rows.uuid,
      room_id: rows.room_id,
      status: rows.status,
      room_name: rows.room.name,
    };

    return result;
  }

  async countByRoomId(roomId: number): Promise<number> {
    const total = await prisma.equipment.count({
      where: { room_id: roomId },
    });

    return total;
  }

  async deleteById(id: number): Promise<EquipmentWithRoom> {
    const rows = await prisma.equipment.delete({
      where: {
        id: id,
      },
      include: { room: { select: { name: true } } },
    });

    const result: EquipmentWithRoom = {
      id: rows.id,
      name: rows.name,
      uuid: rows.uuid,
      room_id: rows.room_id,
      status: rows.status,
      room_name: rows.room.name,
    };
    return result;
  }
}

export const equipmentRepository = new EquipmentRepository();
