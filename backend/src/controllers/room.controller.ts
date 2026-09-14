import { roomService } from "../services/room.service.js";
import { Room } from "../types.js";
import { handleControllerError } from "../utils/error-handler.js";
import { validateId } from "../utils/validate-id.js";
import type { Request, Response } from "express";

class RoomController {
  getAll(req: Request, res: Response) {
    try {
      const rooms: Room[] = roomService.getAll();
      res.json(rooms);
    } catch (error) {
      handleControllerError(error, res);
    }
  }

  getById(req: Request, res: Response) {
    try {
      const roomId: number = validateId(req.params.id);

      const room: Room = roomService.getById(roomId);

      return res.json(room);
    } catch (error) {
      handleControllerError(error, res);
    }
  }

  create(req: Request, res: Response) {
    try {
      const room: Room | undefined = roomService.create(req.body);
      return res.status(201).json(room);
    } catch (error) {
      handleControllerError(error, res);
    }
  }

  update(req: Request, res: Response) {
    try {
      const room: Room = roomService.update(req.params.id, req.body);

      return res.status(200).json(room);
    } catch (error) {
      handleControllerError(error, res);
    }
  }

  delete(req: Request, res: Response) {
    try {
      roomService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      handleControllerError(error, res);
    }
  }
}

export const roomController = new RoomController();
