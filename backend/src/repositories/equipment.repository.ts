import type {
  Equipment,
  EquipmentFilters,
  EquipmentWithRoom,
} from "../types.ts";
import { prisma } from "../database/prisma.js";

class EquipmentRepository {
  private toEquipmentWithRoom(
    data: Equipment & { room: { name: string } },
  ): EquipmentWithRoom {
    return {
      id: data.id,
      name: data.name,
      uuid: data.uuid,
      room_id: data.room_id,
      status: data.status,
      room_name: data.room.name,
    };
  }

  private withRoomName = { room: { select: { name: true } } } as const;

  async create(
    equipment: Omit<Equipment, "id">,
  ): Promise<EquipmentWithRoom | null> {
    const result = await prisma.equipment.create({ data: equipment });

    return this.findById(Number(result.id));
  }

  async findByUuid(uuid: string): Promise<EquipmentWithRoom | null> {
    const rows = await prisma.equipment.findUnique({
      where: {
        uuid,
      },
      include: this.withRoomName,
    });

    if (!rows) {
      return null;
    }

    const result: EquipmentWithRoom = this.toEquipmentWithRoom(rows);

    return result;
  }

  async findById(id: number): Promise<EquipmentWithRoom | null> {
    const rows = await prisma.equipment.findUnique({
      where: { id: id },
      include: this.withRoomName,
    });

    if (!rows) {
      return null;
    }

    const result: EquipmentWithRoom = this.toEquipmentWithRoom(rows);

    return result;
  }

  async findAll(filters: EquipmentFilters = {}): Promise<EquipmentWithRoom[]> {
    const rows = await prisma.equipment.findMany({
      where: {
        room_id: { in: filters.roomIds },
        status: filters.status,
      },
      take: filters.limit,
      include: this.withRoomName,
      orderBy: { id: "asc" },
    });

    const result: EquipmentWithRoom[] = rows.map((row) => {
      return this.toEquipmentWithRoom(row);
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
      include: this.withRoomName,
    });

    const result: EquipmentWithRoom = this.toEquipmentWithRoom(rows);

    return result;
  }

  async updateRoom(id: number, roomId: number): Promise<EquipmentWithRoom> {
    const rows = await prisma.equipment.update({
      where: { id: id },
      data: {
        room_id: roomId,
      },
      include: this.withRoomName,
    });

    const result: EquipmentWithRoom = this.toEquipmentWithRoom(rows);

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
      include: this.withRoomName,
    });

    const result: EquipmentWithRoom = this.toEquipmentWithRoom(rows);
    return result;
  }
}

export const equipmentRepository = new EquipmentRepository();
