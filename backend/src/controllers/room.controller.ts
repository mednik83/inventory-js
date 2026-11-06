import { IdZod } from "../schemas/zod.js";
import { roomService } from "../services/room.service.js";
import { Room } from "../types.js";
import type { Request, Response } from "express";

class RoomController {
  async getAll(req: Request, res: Response): Promise<void> {
    const rooms: Room[] = await roomService.getAll();
    res.json(rooms);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const roomId: number = IdZod.parse(req.params.id);
    const room: Room = await roomService.getById(roomId);
    res.json(room);
  }

  async create(req: Request, res: Response): Promise<void> {
    const room: Room | undefined = await roomService.create(req.body);
    res.status(201).json(room);
  }

  async update(req: Request, res: Response): Promise<void> {
    const room: Room = await roomService.update(req.params.id, req.body);
    res.status(200).json(room);
  }

  async delete(req: Request, res: Response): Promise<void> {
    await roomService.delete(req.params.id);
    res.status(204).send();
  }
}

export const roomController = new RoomController();
