import { equipmentRepository } from "../repositories/equipment.repository.js";
import { roomService } from "./room.service.js";
import { validateId } from "../utils/validate-id.js";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  AppError,
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
  EquipmentStatus,
  EquipmentWithRoom,
} from "../types.js";

function validateFilters(filters: unknown): EquipmentFilters {
  if (typeof filters !== "object" || filters === null) {
    throw new ValidationError("filters is not valid");
  }

  const { limit, room_id, status } = filters as Record<string, unknown>;

  const validFilters = {
    limit: parsePositiveInteger(limit, "limit"),
    roomIds: parseIdsList(room_id),
    status: parseStatus(status),
  };

  return validFilters;
}

function parsePositiveInteger(
  value: unknown,
  fieldName: string,
): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string" && typeof value !== "number") {
    throw new ValidationError(`${fieldName} must be an integer`);
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    throw new ValidationError(`${fieldName} must be an integer`);
  }

  if (parsed <= 0) {
    throw new ValidationError(`${fieldName} must be a positive integer`);
  }

  return parsed;
}

function parseIdsList(value: unknown): number[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ValidationError("room_id must contain only integers");
  }

  const ids = value.split(",").map((id) => {
    const parsed = Number(id.trim());

    if (!Number.isInteger(parsed)) {
      throw new ValidationError("room_id must contain only integers");
    }

    if (parsed <= 0) {
      throw new ValidationError("room_id must contain only positive integers");
    }

    return parsed;
  });

  return ids;
}

function parseStatus(value: unknown): EquipmentStatus | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string") {
    throw new ValidationError("Status must be a string");
  }

  const status = validateStatus(value);

  return status;
}

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
  getById(id: unknown): EquipmentWithRoom {
    const equipmentId = validateId(id);
    const equipment = equipmentRepository.findById(equipmentId);

    if (!equipment) {
      throw new NotFoundError("Equipment not found");
    }

    return equipment;
  }

  getByUuid(uuid: unknown): EquipmentWithRoom {
    const equipmentUuid = validateUuid(uuid);
    const equipment = equipmentRepository.findByUuid(equipmentUuid);

    if (!equipment) {
      throw new NotFoundError("Equipment not found");
    }

    return equipment;
  }

  getAll(filters: unknown) {
    const validFilters = validateFilters(filters);

    return equipmentRepository.findAll(validFilters);
  }

  create(data: unknown): EquipmentWithRoom {
    const validData = validateEquipment(data);

    if (validData.status === "written_off") {
      throw new ValidationError(
        'Status cannot be "written_off" when creating an equipment',
      );
    }

    const room = roomService.getById(validData.room_id);

    const equipment: Omit<Equipment, "id"> = {
      uuid: uuidv4(),
      ...validData,
    };

    const equipmentData = equipmentRepository.create(equipment);

    if (!equipmentData) {
      throw new AppError("Failed to create equipment");
    }

    const newEquipment = {
      ...equipmentData,
      room_name: room.name,
    };

    operationService.create({
      equipment_id: equipmentData.id,
      type: "create",
      comment: `Equipment "${equipmentData.name}" was created`,
    });

    return newEquipment;
  }

  update(id: unknown, data: unknown): EquipmentWithRoom {
    const equipmentId = validateId(id);

    const validData = validateEquipment(data);

    if (validData.status === "written_off") {
      throw new ValidationError(
        'Status cannot be "written_off" when updating an equipment',
      );
    }

    const currentEquipment = this.getById(equipmentId);

    if (currentEquipment.status === "written_off") {
      throw new ValidationError("Written off equipment cannot be updated");
    }

    const room = roomService.getById(validData.room_id);

    const equipmentData = {
      id: equipmentId,
      uuid: currentEquipment.uuid,
      ...validData,
      room_name: room.name,
    };

    equipmentRepository.update(equipmentData);

    operationService.create({
      equipment_id: equipmentData.id,
      type: "update",
      comment: `Equipment "${equipmentData.name}" was updated`,
    });

    return equipmentData;
  }

  move(equipmentId: unknown, data: unknown): EquipmentWithRoom {
    const validEquipmentId = validateId(equipmentId);

    if (typeof data !== "object" || data === null) {
      throw new ValidationError("Invalid data");
    }

    const { room_id } = data as Record<string, unknown>;

    const validRoomId = validateId(room_id);

    const equipment = this.getById(validEquipmentId); // validate equipment id

    if (equipment.status === "written_off") {
      throw new ValidationError("Written off equipment cannot be moved");
    }

    if (validRoomId === equipment.room_id) {
      throw new ValidationError("Equipment is already in the specified room");
    }

    const room = roomService.getById(validRoomId); // validate room id

    equipmentRepository.updateRoom(validEquipmentId, validRoomId);

    operationService.create({
      equipment_id: validEquipmentId,
      type: "move",
      comment: `Equipment "${equipment.name}" was moved from ${equipment.room_name} to ${room.name}`,
    });

    return this.getById(validEquipmentId);
  }

  writeOff(id: unknown): EquipmentWithRoom {
    const equipmentId = validateId(id);
    const equipment = this.getById(equipmentId);

    if (equipment.status === "written_off") {
      throw new ConflictError("The equipment has already been written off.");
    }

    const equipmentData: EquipmentWithRoom = {
      ...equipment,
      status: "written_off",
    };

    equipmentRepository.update(equipmentData);

    operationService.create({
      equipment_id: equipmentId,
      type: "write_off",
      comment: `Equipment "${equipmentData.name}" was written off`,
    });

    return equipmentData;
  }

  forceDelete(id: unknown): boolean {
    const equipmentId = validateId(id);
    this.getById(equipmentId); // validate id

    operationRepository.deleteByEquipmentId(equipmentId);

    equipmentRepository.deleteById(equipmentId);

    return true;
  }
}

export const equipmentService = new EquipmentService();
