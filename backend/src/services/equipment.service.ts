import { equipmentRepository } from "../repositories/equipment.repository.js";
import { roomService } from "./room.service.js";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  AppError,
} from "../errors/errors.js";
import { v4 as uuidv4 } from "uuid";
import { operationService } from "./operation.service.js";
import { operationRepository } from "../repositories/operation.repository.js";
import type {
  Equipment,
  EquipmentFilters,
  EquipmentWithRoom,
} from "../types.js";
import {
  EquipmentZod,
  IdZod,
  MoveEquipmentZod,
  UuidZod,
  filtersZod,
} from "../schemas/zod.js";

function validateFilters(filters: unknown): EquipmentFilters {
  if (typeof filters !== "object" || filters === null) {
    throw new ValidationError("filters is not valid");
  }

  const { limit, room_id, status } = filters as Record<string, unknown>;

  const validFilters = filtersZod.parse({
    limit: limit,
    roomIds: room_id,
    status: status,
  });

  return validFilters;
}

class EquipmentService {
  async getById(id: unknown): Promise<EquipmentWithRoom> {
    const equipmentId = IdZod.parse(id);
    const equipment = await equipmentRepository.findById(equipmentId);

    if (!equipment) {
      throw new NotFoundError("Equipment not found");
    }

    return equipment;
  }

  async getByUuid(uuid: unknown): Promise<EquipmentWithRoom> {
    const equipmentUuid = UuidZod.parse(uuid);
    const equipment = await equipmentRepository.findByUuid(equipmentUuid);

    if (!equipment) {
      throw new NotFoundError("Equipment not found");
    }

    return equipment;
  }

  async getAll(filters: unknown) {
    const validFilters = validateFilters(filters);

    return await equipmentRepository.findAll(validFilters);
  }

  async create(data: unknown): Promise<EquipmentWithRoom> {
    const validData = EquipmentZod.parse(data);

    if (validData.status === "written_off") {
      throw new ValidationError(
        'Status cannot be "written_off" when creating an equipment',
      );
    }

    const room = await roomService.getById(validData.room_id);

    const equipment: Omit<Equipment, "id"> = {
      ...validData,
      uuid: uuidv4(),
    };

    const equipmentData = equipmentRepository.create(equipment);

    if (!equipmentData) {
      throw new AppError("Failed to create equipment");
    }

    const newEquipment = {
      ...equipmentData,
      room_name: room.name,
    };

    await operationService.create({
      equipment_id: equipmentData.id,
      type: "create",
      comment: `Equipment "${equipmentData.name}" was created`,
    });

    return newEquipment;
  }

  async update(id: unknown, data: unknown): Promise<EquipmentWithRoom> {
    const equipmentId = IdZod.parse(id);

    const validData = EquipmentZod.parse(data);

    if (validData.status === "written_off") {
      throw new ValidationError(
        'Status cannot be "written_off" when updating an equipment',
      );
    }

    const currentEquipment = await this.getById(equipmentId);

    if (currentEquipment.status === "written_off") {
      throw new ValidationError("Written off equipment cannot be updated");
    }

    const room = await roomService.getById(validData.room_id);

    const equipmentData = {
      ...validData,
      room_name: room.name,
      id: equipmentId,
      uuid: currentEquipment.uuid,
    };

    await equipmentRepository.update(equipmentData);

    await operationService.create({
      equipment_id: equipmentData.id,
      type: "update",
      comment: `Equipment "${equipmentData.name}" was updated`,
    });

    return equipmentData;
  }

  async move(equipmentId: unknown, data: unknown): Promise<EquipmentWithRoom> {
    const validEquipmentId = IdZod.parse(equipmentId);

    const validRoomId = MoveEquipmentZod.parse(data).room_id;

    const equipment = await this.getById(validEquipmentId); // validate equipment id

    if (equipment.status === "written_off") {
      throw new ValidationError("Written off equipment cannot be moved");
    }

    if (validRoomId === equipment.room_id) {
      throw new ValidationError("Equipment is already in the specified room");
    }

    const room = await roomService.getById(validRoomId); // validate room id

    await equipmentRepository.updateRoom(validEquipmentId, validRoomId);

    await operationService.create({
      equipment_id: validEquipmentId,
      type: "move",
      comment: `Equipment "${equipment.name}" was moved from ${equipment.room_name} to ${room.name}`,
    });

    return await this.getById(validEquipmentId);
  }

  async writeOff(id: unknown): Promise<EquipmentWithRoom> {
    const equipmentId = IdZod.parse(id);
    const equipment = await this.getById(equipmentId);

    if (equipment.status === "written_off") {
      throw new ConflictError("The equipment has already been written off.");
    }

    const equipmentData: EquipmentWithRoom = {
      ...equipment,
      status: "written_off",
    };

    await equipmentRepository.update(equipmentData);

    await operationService.create({
      equipment_id: equipmentId,
      type: "write_off",
      comment: `Equipment "${equipmentData.name}" was written off`,
    });

    return equipmentData;
  }

  async forceDelete(id: unknown): Promise<boolean> {
    const equipmentId = IdZod.parse(id);
    await this.getById(equipmentId); // validate id

    await operationRepository.deleteByEquipmentId(equipmentId);

    await equipmentRepository.deleteById(equipmentId);

    return true;
  }
}

export const equipmentService = new EquipmentService();
