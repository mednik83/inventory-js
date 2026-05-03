import { roomRepository } from "../repositories/room.repository.js";

class RoomService {
  getAll(limit = 0) {
    return roomRepository.findAll(limit);
  }
}

export const roomService = new RoomService();
