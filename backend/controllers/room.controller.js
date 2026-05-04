import { roomService } from "../services/room.service.js";
import { handleControllerError } from "../utils/error-handler.js";

class RoomController {
  getAll(req, res) {
    try {
      const rooms = roomService.getAll();
      res.json(rooms);
    } catch (error) {
      handleControllerError(error, res);
    }
  }
}

export const roomController = new RoomController();
