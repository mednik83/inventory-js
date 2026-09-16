import { ValidationError } from "../errors/errors.js";
import { equipmentService } from "../services/equipment.service.js";
import { qrCodeService } from "../services/qr-code.service.js";
import { validateStatus } from "../utils/validate-status.js";
import { validateUuid } from "../utils/validate-uuid.js";
import type { NextFunction, Request, Response } from "express";
import type { EquipmentStatus, EquipmentWithRoom } from "../types.js";

function parsePositiveInteger(
  value: unknown,
  fieldName: string,
): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string" || typeof value !== "number") {
    throw new ValidationError(`${fieldName} must be an integer`);
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    throw new ValidationError(`${fieldName} must be an integer`);
  }

  if (parsed <= 0) {
    throw new ValidationError(`${fieldName} must be a positive integer`);
  }

  return parsed;
}

function parseIdsList(value: unknown): number[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ValidationError("room_id must contain only integers");
  }

  const ids = value.split(",").map((id) => {
    const parsed = Number(id.trim());

    if (!Number.isInteger(parsed)) {
      throw new ValidationError("room_id must contain only integers");
    }

    if (parsed <= 0) {
      throw new ValidationError("room_id must contain only positive integers");
    }

    return parsed;
  });

  return ids;
}

function parseStatus(value: unknown): EquipmentStatus | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string") {
    throw new ValidationError("Status must be a string");
  }

  const status = validateStatus(value);

  return status;
}

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
      const { limit, room_id, status } = req.query;

      const filters = {
        limit: parsePositiveInteger(limit, "limit"),
        roomIds: parseIdsList(room_id),
        status: parseStatus(status),
      };
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
