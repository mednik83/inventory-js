import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../errors/errors.js";
import { equipmentRepository } from "../repositories/equipment.repository.js";
import { roomRepository } from "../repositories/room.repository.js";
import type { Room } from "../types.js";
import { validateId } from "../utils/validate-id.js";

function validateRoom(data: unknown): Omit<Room, "id"> {
  if (typeof data !== "object" || data === null) {
    throw new ValidationError("Invalid room data");
  }

  const { name } = data as Record<string, unknown>;

  if (typeof name !== "string") {
    throw new ValidationError("The room name can be string");
  }

  const trimmed = name.trim();

  if (!trimmed) {
    throw new ValidationError("The room name can not be empty");
  }

  if (trimmed.length < 2) {
    throw new ValidationError("The room name is too short or empty");
  }

  return {
    name: trimmed,
  };
}

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
    const validData = validateRoom(data);

    const room = {
      ...validData,
    };

    if (roomRepository.findByName(room.name)) {
      throw new ValidationError("The room must be unique");
    }

    return roomRepository.create(room);
  }

  update(id: unknown, data: unknown) {
    const validData = validateRoom(data);
    const roomId = validateId(id);

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
