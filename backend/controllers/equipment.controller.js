import { equipmentService } from "../services/equipment.service.js";
import { handleControllerError } from "../utils/error-handler.js";

class EquipmentController {
  getById(req, res) {
    try {
      const equipment = equipmentService.getById(req.params.id);

      return res.json(equipment);
    } catch (error) {
      return handleControllerError(error, res);
    }
  }
  getAll(req, res) {
    try {
      const equipments = equipmentService.getAll();
      return res.json(equipments);
    } catch (error) {
      return handleControllerError(error, res);
    }
  }

  create(req, res) {
    try {
      const equipment = equipmentService.create(req.body);
      return res.status(201).json(equipment);
    } catch (error) {
      return handleControllerError(error, res);
    }
  }
  update(req, res) {
    try {
      const equipment = equipmentService.update(req.params.id, req.body);

      return res.status(200).json(equipment);
    } catch (error) {
      return handleControllerError(error, res);
    }
  }
  remove(req, res) {
    try {
      equipmentService.delete(req.params.id);

      return res.status(204).send();
    } catch (error) {
      return handleControllerError(error, res);
    }
  }
}

export const equipmentController = new EquipmentController();
