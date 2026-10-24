import { equipmentService } from "../services/equipment.service.js";
import { qrCodeService } from "../services/qr-code.service.js";
import type { NextFunction, Request, Response } from "express";
import type { EquipmentWithRoom } from "../types.js";
import { UuidZod } from "../schemas/zod.js";

class EquipmentController {
  async getById(req: Request, res: Response): Promise<void> {
    const equipment = await equipmentService.getById(req.params.id);
    res.json(equipment);
  }

  async getByUuid(req: Request, res: Response): Promise<void> {
    const equipment = await equipmentService.getByUuid(req.params.uuid);
    res.json(equipment);
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const filters: unknown = req.query;
    const equipments = await equipmentService.getAll(filters);
    res.json(equipments);
  }

  async create(req: Request, res: Response): Promise<void> {
    const equipment = await equipmentService.create(req.body);
    res.status(201).json(equipment);
  }

  async update(req: Request, res: Response): Promise<void> {
    const equipment = await equipmentService.update(req.params.id, req.body);
    res.status(200).json(equipment);
  }

  async move(req: Request, res: Response): Promise<void> {
    const equipment = await equipmentService.move(req.params.id, req.body);
    res.status(200).json(equipment);
  }

  async writeOff(req: Request, res: Response): Promise<void> {
    const equipment: EquipmentWithRoom = await equipmentService.writeOff(
      req.params.id,
    );
    res.status(200).json(equipment);
  }

  async forceDelete(req: Request, res: Response): Promise<void> {
    await equipmentService.forceDelete(req.params.id);
    res.status(204).send();
  }

  async getQrByUuid(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { uuid } = req.params;

    const validUuid = UuidZod.parse(uuid);
    const equipment = await equipmentService.getByUuid(validUuid);

    qrCodeService
      .generateSvg(equipment.uuid)
      .then((qrSvg) => {
        res.type("image/svg+xml");
        res.send(qrSvg);
      })
      .catch(next);
  }
}

export const equipmentController = new EquipmentController();
