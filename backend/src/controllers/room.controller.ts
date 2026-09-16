import { roomService } from "../services/room.service.js";
import { Room } from "../types.js";
import { validateId } from "../utils/validate-id.js";
import type { NextFunction, Request, Response } from "express";

class RoomController {
  getAll(req: Request, res: Response, next: NextFunction): void {
    try {
      const rooms: Room[] = roomService.getAll();
      res.json(rooms);
    } catch (error) {
      next(error);
    }
  }

  getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const roomId: number = validateId(req.params.id);

      const room: Room = roomService.getById(roomId);

      res.json(room);
    } catch (error) {
      next(error);
    }
  }

  create(req: Request, res: Response, next: NextFunction): void {
    try {
      const room: Room | undefined = roomService.create(req.body);
      res.status(201).json(room);
    } catch (error) {
      next(error);
    }
  }

  update(req: Request, res: Response, next: NextFunction): void {
    try {
      const room: Room = roomService.update(req.params.id, req.body);

      res.status(200).json(room);
    } catch (error) {
      next(error);
    }
  }

  delete(req: Request, res: Response, next: NextFunction): void {
    try {
      roomService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const roomController = new RoomController();
