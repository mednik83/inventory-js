import { equipmentRepository } from "../repositories/equipment.repository.js";

function validateId(id) {
  const equipmentId = Number(id);

  if (!Number.isInteger(equipmentId) || equipmentId <= 0) {
    throw new Error("Invalid ID");
  }

  return equipmentId;
}

function validateEquipment(data) {
  const name = data.name?.trim();
  const room_id = String(data.room_id)?.trim();
  const status = data.status?.trim();

  if (name.length < 2) {
    throw new Error("The name is too short");
  }

  if (Number.isNaN(+room_id)) {
    throw new Error("The room number must be a number");
  }

  if (!name || !room_id || !status) {
    throw new Error("Invalid equipment data");
  }

  return {
    name,
    room_id: Number(room_id),
    status,
  };
}

class EquipmentService {
  getById(id) {
    const equipmentId = validateId(id);
    const equipment = equipmentRepository.findById(equipmentId);

    if (!equipment) {
      return false;
    }
    return equipment;
  }

  getAll(limit = 0) {
    return equipmentRepository.findAll();
  }

  create(data) {
    const validData = validateEquipment(data);

    const equipment = {
      id: Date.now(),
      ...validData,
    };

    return equipmentRepository.create(equipment);
  }

  update(id, data) {
    const equipmentId = validateId(id);
    const validData = validateEquipment(data);

    const equipment = {
      id: equipmentId,
      ...validData,
    };

    const result = equipmentRepository.update(equipment);

    if (result.changes === 0) {
      return false;
    }

    return equipment;
  }

  delete(id) {
    const equipmentId = validateId(id);

    const result = equipmentRepository.deleteById(equipmentId);

    if (result.changes === 0) {
      return false;
    }

    return true;
  }
}

export const equipmentService = new EquipmentService();
