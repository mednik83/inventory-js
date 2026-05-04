import { equipmentRepository } from "../repositories/equipment.repository.js";
import { roomService } from "./room.service.js";
import { validateId } from "../utils/validate-id.js";
import { ValidationError, NotFoundError } from "../errors/errors.js";

function validateEquipment(data) {
  const name = data.name?.trim();
  const roomIdRaw = data.room_id;
  const status = data.status?.trim();

  if (!name || !status || roomIdRaw === undefined || roomIdRaw === null) {
    throw new ValidationError("Invalid equipment data");
  }

  const allowedStatuses = ["active", "inactive", "written_off"];

  if (!allowedStatuses.includes(status)) {
    throw new ValidationError("Invalid status");
  }

  if (name.length < 2) {
    throw new ValidationError("The name is too short");
  }

  const room_id = Number(roomIdRaw);

  if (!Number.isInteger(room_id) || room_id <= 0) {
    throw new ValidationError("The room id must be a positive integer");
  }

  return {
    name,
    room_id,
    status,
  };
}

class EquipmentService {
  getById(id) {
    const equipmentId = validateId(id);
    const equipment = equipmentRepository.findById(equipmentId);

    if (!equipment) {
      throw new NotFoundError("Equipment not found");
    }
    return equipment;
  }

  getAll() {
    return equipmentRepository.findAll();
  }

  create(data) {
    const validData = validateEquipment(data);

    roomService.getById(validData.room_id);

    const equipment = {
      ...validData,
    };

    return equipmentRepository.create(equipment);
  }

  update(id, data) {
    const equipmentId = validateId(id);

    const validData = validateEquipment(data);

    roomService.getById(validData.room_id);

    const equipment = {
      id: equipmentId,
      ...validData,
    };

    const result = equipmentRepository.update(equipment);

    if (result.changes === 0) {
      throw new NotFoundError("Equipment not found");
    }

    return equipment;
  }

  delete(id) {
    const equipmentId = validateId(id);

    const result = equipmentRepository.deleteById(equipmentId);

    if (result.changes === 0) {
      throw new NotFoundError("Equipment not found");
    }

    return true;
  }
}

export const equipmentService = new EquipmentService();
