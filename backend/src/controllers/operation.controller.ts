import { IdZod } from "../schemas/zod.js";
import { operationService } from "../services/operation.service.js";
import type { NextFunction, Request, Response } from "express";

class OperationController {
  getByEquipmentId(req: Request, res: Response, next: NextFunction): void {
    try {
      const equipmentId: number = IdZod.parse(req.query.equipment_id);
      const operations = operationService.getByEquipmentId(equipmentId);
      res.json(operations);
    } catch (error) {
      next(error);
    }
  }
}

export const operationController = new OperationController();
