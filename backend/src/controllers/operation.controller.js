import { operationService } from "../services/operation.service.js";
import { handleControllerError } from "../utils/error-handler.js";
import { validateId } from "../utils/validate-id.js";

class OperationController {
  getByEquipmentId(req, res) {
    try {
      const equipmentId = validateId(req.query.equipment_id);
      const operations = operationService.getByEquipmentId(equipmentId);
      return res.json(operations);
    } catch (error) {
      handleControllerError(error, res);
    }
  }
}

export const operationController = new OperationController();
