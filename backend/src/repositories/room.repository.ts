import { Room } from "../types.js";

import { prisma } from "../database/prisma.js";

class RoomRepository {
  async findAll(limit: number = 0): Promise<Room[]> {
    return await prisma.room.findMany({
      take: limit > 0 ? limit : undefined,
    });
  }

  async findByName(name: string): Promise<Room | null> {
    return await prisma.room.findUnique({ where: { name } });
  }

  async findById(id: number): Promise<Room | null> {
    return await prisma.room.findUnique({ where: { id } });
  }

  async create(room: Omit<Room, "id">): Promise<Room> {
    return await prisma.room.create({ data: room });
  }

  async update(room: Room): Promise<Room> {
    return await prisma.room.update({
      where: { id: room.id },
      data: { name: room.name },
    });
  }

  async deleteById(id: number): Promise<Room> {
    return await prisma.room.delete({ where: { id } });
  }
}

export const roomRepository = new RoomRepository();
