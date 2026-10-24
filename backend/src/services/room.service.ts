import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../errors/errors.js";
import { equipmentRepository } from "../repositories/equipment.repository.js";
import { roomRepository } from "../repositories/room.repository.js";
import { IdZod, RoomZod } from "../schemas/zod.js";

class RoomService {
  async getAll() {
    return await roomRepository.findAll();
  }
  async getById(id: unknown) {
    const roomId = IdZod.parse(id);

    const room = await roomRepository.findById(roomId);

    if (!room) {
      throw new NotFoundError("Room not found");
    }

    return room;
  }

  async create(data: unknown) {
    const validData = RoomZod.parse(data);

    if (await roomRepository.findByName(validData.name)) {
      throw new ValidationError("The room must be unique");
    }

    return await roomRepository.create(validData);
  }

  async update(id: unknown, data: unknown) {
    const roomId = IdZod.parse(id);
    const validData = RoomZod.parse(data);

    const existing = await roomRepository.findByName(validData.name);
    if (existing && existing.id !== roomId) {
      throw new ValidationError("The room must be unique");
    }

    const room = {
      id: roomId,
      ...validData,
    };

    const result = roomRepository.update(room);

    if (result.changes === 0) {
      throw new NotFoundError("Room not found");
    }

    return room;
  }

  async delete(id: unknown) {
    const roomId = IdZod.parse(id);

    const room = await roomRepository.findById(roomId);

    if (!room) {
      throw new NotFoundError("Room not found");
    }

    const equipmentsCount = await equipmentRepository.countByRoomId(roomId);

    if (equipmentsCount > 0) {
      throw new ConflictError(
        "Room cannot be deleted because it is used by equipment",
      );
    }

    return roomRepository.deleteById(roomId);
  }
}

export const roomService = new RoomService();
