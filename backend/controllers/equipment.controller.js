import { equipmentService } from "../services/equipment.service.js";

class EquipmentController {
  getById(req, res) {
    try {
      const equipment = equipmentService.getById(req.params.id);

      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      res.json(equipment);
    } catch (error) {
      if (error.message === "Equipment not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: error.message });
    }
  }
  getAll(req, res) {
    try {
      const equipments = equipmentService.getAll();
      res.json(equipments);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get equipments" });
    }
  }
  create(req, res) {
    try {
      const equipment = equipmentService.create(req.body);
      res.status(201).json(equipment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  update(req, res) {
    try {
      const equipment = equipmentService.update(req.params.id, req.body);

      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      res.status(200).json(equipment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  remove(req, res) {
    try {
      const deleted = equipmentService.delete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const equipmentController = new EquipmentController();
