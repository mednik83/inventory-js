import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../errors/errors.js";
import { equipmentRepository } from "../repositories/equipment.repository.js";
import { roomRepository } from "../repositories/room.repository.js";
import { RoomZod } from "../schemas/zod.js";
import { validateId } from "../utils/validate-id.js";

class RoomService {
  getAll() {
    return roomRepository.findAll();
  }
  getById(id: unknown) {
    const roomId = validateId(id);

    const room = roomRepository.findById(roomId);

    if (!room) {
      throw new NotFoundError("Room not found");
    }

    return room;
  }

  create(data: unknown) {
    const validData = RoomZod.parse(data);

    if (roomRepository.findByName(validData.name)) {
      throw new ValidationError("The room must be unique");
    }

    return roomRepository.create(validData);
  }

  update(id: unknown, data: unknown) {
    const roomId = validateId(id);
    const validData = RoomZod.parse(data);

    const existing = roomRepository.findByName(validData.name);
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

  delete(id: unknown) {
    const roomId = validateId(id);

    const room = roomRepository.findById(roomId);

    if (!room) {
      throw new NotFoundError("Room not found");
    }

    const equipmentsCount = equipmentRepository.countByRoomId(roomId);

    if (equipmentsCount > 0) {
      throw new ConflictError(
        "Room cannot be deleted because it is used by equipment",
      );
    }

    return roomRepository.deleteById(roomId);
  }
}

export const roomService = new RoomService();
