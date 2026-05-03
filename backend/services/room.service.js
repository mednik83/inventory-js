import { roomRepository } from "../repositories/room.repository.js";

class RoomService {
  getAll(limit = 0) {
    return roomRepository.findAll(limit);
  }
  getById(id) {
    const room = roomRepository.findById(id);

    if (!room) {
      return false;
    }

    return room;
  }
}

export const roomService = new RoomService();
