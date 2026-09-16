import { operationService } from "../services/operation.service.js";
import { validateId } from "../utils/validate-id.js";
import type { NextFunction, Request, Response } from "express";

class OperationController {
  getByEquipmentId(req: Request, res: Response, next: NextFunction): void {
    try {
      const equipmentId: number = validateId(req.query.equipment_id);
      const operations = operationService.getByEquipmentId(equipmentId);
      res.json(operations);
    } catch (error) {
      next(error);
    }
  }
}

export const operationController = new OperationController();
