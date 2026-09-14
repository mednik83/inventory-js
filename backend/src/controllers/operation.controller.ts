import { operationService } from "../services/operation.service.js";
import { handleControllerError } from "../utils/error-handler.js";
import { validateId } from "../utils/validate-id.js";
import type { Request, Response } from "express";

class OperationController {
  getByEquipmentId(req: Request, res: Response) {
    try {
      const equipmentId: number = validateId(req.query.equipment_id);
      const operations = operationService.getByEquipmentId(equipmentId);
      return res.json(operations);
    } catch (error) {
      handleControllerError(error, res);
    }
  }
}

export const operationController = new OperationController();
