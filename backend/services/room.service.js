import { NotFoundError, ValidationError } from "../errors/errors.js";
import { roomRepository } from "../repositories/room.repository.js";
import { validateId } from "../utils/validate-id.js";

function validateRoom(data) {
  const name = data.name?.trim();

  if (!name) {
    throw new ValidationError("The room name can not be empty");
  }

  if (name.length < 2) {
    throw new ValidationError("The room name is too short");
  }

  return {
    name,
  };
}

class RoomService {
  getAll() {
    return roomRepository.findAll();
  }
  getById(id) {
    const roomId = validateId(id);

    const room = roomRepository.findById(roomId);

    if (!room) {
      throw new NotFoundError("Room not found");
    }

    return room;
  }

  create(data) {
    const validData = validateRoom(data);

    const room = {
      ...validData,
    };

    return roomRepository.create(room);
  }

  update(id, data) {
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

  delete(id) {
    const roomId = validateId(id);

    const result = roomRepository.deleteById(id);

    if (result.changes === 0) {
      throw new NotFoundError("Room not found");
    }

    return true;
  }
}

export const roomService = new RoomService();
