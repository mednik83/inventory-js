import { roomService } from "../services/room.service.js";
import { handleControllerError } from "../utils/error-handler.js";
import { validateId } from "../utils/validate-id.js";

class RoomController {
  getAll(req, res) {
    try {
      const rooms = roomService.getAll();
      res.json(rooms);
    } catch (error) {
      handleControllerError(error, res);
    }
  }

  getById(req, res) {
    try {
      const roomId = validateId(req.params.id);

      const room = roomService.getById(roomId);

      return res.json(room);
    } catch (error) {
      handleControllerError(error, res);
    }
  }

  create(req, res) {
    try {
      const room = roomService.create(req.body);
      return res.status(201).json(room);
    } catch (error) {
      handleControllerError(error, res);
    }
  }

  update(req, res) {
    try {
      const room = roomService.update(req.params.id, req.body);

      return res.status(200).json(room);
    } catch (error) {
      handleControllerError(error, res);
    }
  }

  delete(req, res) {
    try {
      roomService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      handleControllerError(error, res);
    }
  }
}

export const roomController = new RoomController();
