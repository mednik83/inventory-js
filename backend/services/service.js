import { equipmentRepository } from "../repositories/repository.js";

function validateId(id) {
  const equipmentId = Number(id);

  if (!Number.isInteger(equipmentId) || equipmentId <= 0) {
    throw new Error("Invalid ID");
  }

  return equipmentId;
}

function validateEquipment(data) {
  const name = data.name?.trim();
  const room = data.room?.trim();
  const status = data.status?.trim();

  if (!name || !room || !status) {
    throw new Error("Invalid equipment data");
  }

  return {
    name,
    room,
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

  getAll() {
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
