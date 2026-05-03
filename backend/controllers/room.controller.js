import { roomService } from "../services/room.service.js";

class RoomController {
  getAll(req, res) {
    try {
      const rooms = roomService.getAll();
      res.json(rooms);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get rooms" });
    }
  }
}

export const roomController = new RoomController();
