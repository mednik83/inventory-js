import { equipmentRepository } from "../repositories/equipment.repository.js";
import { roomService } from "./room.service.js";
import { validateId } from "../utils/validate-id.js";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from "../errors/errors.js";
import { validateStatus } from "../utils/validate-status.js";
import { v4 as uuidv4 } from "uuid";
import { validateUuid } from "../utils/validate-uuid.js";
import { operationService } from "./operation.service.js";
import { operationRepository } from "../repositories/operation.repository.js";
import type {
  Equipment,
  EquipmentFilters,
  EquipmentFormData,
  EquipmentWithRoom,
} from "../types.js";

function validateEquipment(data: unknown): Omit<EquipmentFormData, "uuid"> {
  if (typeof data !== "object" || data === null) {
    throw new ValidationError("Invalid equipment data");
  }

  const { name, room_id, status } = data as Record<string, unknown>;

  if (typeof name !== "string" || typeof status !== "string") {
    throw new ValidationError("Invalid equipment data");
  }

  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    throw new ValidationError("The name is too short");
  }

  const roomId = Number(room_id);
  if (!Number.isInteger(roomId) || roomId <= 0) {
    throw new ValidationError("The room id must be a positive integer");
  }

  return {
    name: trimmedName,
    room_id: roomId,
    status: validateStatus(status.trim()),
  };
}

class EquipmentService {
  getById(id: unknown) {
    const equipmentId = validateId(id);
    const equipment = equipmentRepository.findById(equipmentId);

    if (!equipment) {
      throw new NotFoundError("Equipment not found");
    }

    return equipment;
  }

  getByUuid(uuid: unknown) {
    const equipmentUuid = validateUuid(uuid);
    const equipment = equipmentRepository.findByUuid(equipmentUuid);

    if (!equipment) {
      throw new NotFoundError("Equipment not found");
    }

    return equipment;
  }

  getAll(filters: EquipmentFilters) {
    return equipmentRepository.findAll(filters);
  }

  create(data: unknown) {
    const validData = validateEquipment(data);

    if (validData.status === "written_off") {
      throw new ValidationError(
        'Status cannot be "written_off" when creating an equipment',
      );
    }

    roomService.getById(validData.room_id);

    const equipment: Omit<Equipment, "id"> = {
      uuid: uuidv4(),
      ...validData,
    };

    const newEquipment = equipmentRepository.create(equipment);

    if (!newEquipment) {
      throw new Error("Не удалось создать оборудование");
    }

    operationService.create({
      equipment_id: newEquipment.id,
      type: "create",
      comment: `Equipment "${newEquipment.name}" was created`,
    });

    return newEquipment;
  }

  update(id: unknown, data: unknown) {
    const equipmentId = validateId(id);

    const validData = validateEquipment(data);

    if (validData.status === "written_off") {
      throw new ValidationError(
        'Status cannot be "written_off" when updating an equipment',
      );
    }

    const currentEquipment = this.getById(equipmentId);

    roomService.getById(validData.room_id);

    const equipment = {
      id: equipmentId,
      uuid: currentEquipment.uuid,
      ...validData,
    };

    const result = equipmentRepository.update(equipment);

    if (result === 0) {
      throw new NotFoundError("Equipment not found");
    }

    operationService.create({
      equipment_id: equipment.id,
      type: "update",
      comment: `Equipment "${equipment.name}" was updated`,
    });

    return equipment;
  }

  writeOff(id: unknown) {
    const equipmentId = validateId(id);
    const equipment = this.getById(equipmentId);

    if (equipment.status === "written_off") {
      throw new ConflictError("The equipment has already been written off.");
    }

    const equipmentData: EquipmentWithRoom = {
      ...equipment,
      status: "written_off",
    };

    const totalUpdated = equipmentRepository.update(equipmentData);
    if (totalUpdated === 0) {
      throw new NotFoundError(`Equipment with id=${equipment.id} not found`);
    }

    operationService.create({
      equipment_id: equipmentId,
      type: "write_off",
      comment: `Equipment "${equipmentData.name}" was written off`,
    });

    return equipmentData;
  }

  forceDelete(id: unknown) {
    const equipmentId = validateId(id);
    this.getById(equipmentId); // validate id

    operationRepository.deleteByEquipmentId(equipmentId);

    equipmentRepository.deleteById(equipmentId);

    return true;
  }
}

export const equipmentService = new EquipmentService();
