import { IdZod } from "../schemas/zod.js";
import { operationService } from "../services/operation.service.js";
import type { Request, Response } from "express";

class OperationController {
  async getByEquipmentId(req: Request, res: Response): Promise<void> {
    const equipmentId: number = IdZod.parse(req.query.equipment_id);
    const operations = await operationService.getByEquipmentId(equipmentId);
    res.json(operations);
  }
}

export const operationController = new OperationController();
