import { equipmentService } from "../services/equipment.service.js";
import { qrCodeService } from "../services/qr-code.service.js";
import { validateUuid } from "../utils/validate-uuid.js";
import type { NextFunction, Request, Response } from "express";
import type { EquipmentWithRoom } from "../types.js";

class EquipmentController {
  getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const equipment = equipmentService.getById(req.params.id);
      res.json(equipment);
    } catch (error) {
      next(error);
    }
  }

  getByUuid(req: Request, res: Response, next: NextFunction): void {
    try {
      const equipment = equipmentService.getByUuid(req.params.uuid);
      res.json(equipment);
    } catch (error) {
      next(error);
    }
  }

  getAll(req: Request, res: Response, next: NextFunction): void {
    try {
      const filters: unknown = req.query;
      const equipments = equipmentService.getAll(filters);
      res.json(equipments);
    } catch (error) {
      next(error);
    }
  }

  create(req: Request, res: Response, next: NextFunction): void {
    try {
      const equipment = equipmentService.create(req.body);
      res.status(201).json(equipment);
    } catch (error) {
      next(error);
    }
  }

  update(req: Request, res: Response, next: NextFunction): void {
    try {
      const equipment = equipmentService.update(req.params.id, req.body);

      res.status(200).json(equipment);
    } catch (error) {
      next(error);
    }
  }

  writeOff(req: Request, res: Response, next: NextFunction): void {
    try {
      const equipment: EquipmentWithRoom = equipmentService.writeOff(
        req.params.id,
      );

      res.status(200).json(equipment);
    } catch (error) {
      next(error);
    }
  }

  forceDelete(req: Request, res: Response, next: NextFunction): void {
    try {
      equipmentService.forceDelete(req.params.id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  getQrByUuid(req: Request, res: Response, next: NextFunction): void {
    try {
      const { uuid } = req.params;

      const validUuid = validateUuid(uuid);
      const equipment = equipmentService.getByUuid(validUuid);

      qrCodeService
        .generateSvg(equipment.uuid)
        .then((qrSvg) => {
          res.type("image/svg+xml");
          res.send(qrSvg);
        })
        .catch(next);
    } catch (error) {
      next(error);
    }
  }
}

export const equipmentController = new EquipmentController();
