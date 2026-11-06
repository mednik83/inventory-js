import { Room } from "../types.js";

import { prisma } from "../database/prisma.js";
import { Prisma } from "../generated/prisma/client.js";

class RoomRepository {
  async findAll(limit: number = 0): Promise<Room[]> {
    return await prisma.room.findMany({
      take: limit > 0 ? limit : undefined,
    });
  }

  async findByName(name: string): Promise<Room | null> {
    return await prisma.room.findUnique({ where: { name } });
  }

  async findById(
    id: number,
    db: Prisma.TransactionClient = prisma,
  ): Promise<Room | null> {
    return await db.room.findUnique({ where: { id } });
  }

  async create(
    room: Omit<Room, "id">,
    db: Prisma.TransactionClient = prisma,
  ): Promise<Room> {
    return await db.room.create({ data: room });
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
