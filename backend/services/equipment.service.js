import { equipmentRepository } from "../repositories/equipment.repository.js";
import { roomService } from "./room.service.js";
import { validateId } from "../utils/validate-id.js";
import { ValidationError, NotFoundError } from "../errors/errors.js";
import { validateStatus } from "../utils/validate-status.js";
import { v4 as uuidv4 } from "uuid";
import { validateUuid } from "../utils/validate-uuid.js";
import { operationService } from "./operation.service.js";
import { operationRepository } from "../repositories/operation.repository.js";

function validateEquipment(data) {
  const name = data.name?.trim();
  const roomIdRaw = data.room_id;
  const status = data.status?.trim();

  if (!name || !status || roomIdRaw === undefined || roomIdRaw === null) {
    throw new ValidationError("Invalid equipment data");
  }

  validateStatus(status);

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

  getByUuid(uuid) {
    const equipmentUuid = validateUuid(uuid);
    const equipment = equipmentRepository.findByUuid(equipmentUuid);

    if (!equipment) {
      throw new NotFoundError("Equipment not found");
    }

    return equipment;
  }

  getAll(filters) {
    return equipmentRepository.findAll(filters);
  }

  create(data) {
    const validData = validateEquipment(data);

    roomService.getById(validData.room_id);

    const equipment = {
      uuid: uuidv4(),
      ...validData,
    };

    const newEquipment = equipmentRepository.create(equipment);

    operationService.create(
      newEquipment.id,
      "created",
      `Equipment "${newEquipment.name}" created`,
    );

    return newEquipment;
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

    operationService.create(
      equipment.id,
      "updated",
      `Equipment "${equipment.name}" updated`,
    );

    return equipment;
  }

  writtenOff(id) {
    const equipmentId = validateId(id);
    const equipment = this.getById(equipmentId);

    const equipmentData = {
      id: equipmentId,
      name: equipment.name,
      room_id: equipment.room_id,
      status: "written_off",
    };

    equipmentRepository.update(equipmentData);

    operationService.create(
      equipmentId,
      "written_off",
      `Equipment with id=${equipmentId} was written_off`,
    );

    return true;
  }

  forceDelete(id) {
    const equipmentId = validateId(id);
    this.getById(equipmentId); // validate id

    operationRepository.deleteByEquipmentId(equipmentId);

    equipmentRepository.deleteById(equipmentId);

    return true;
  }
}

export const equipmentService = new EquipmentService();
