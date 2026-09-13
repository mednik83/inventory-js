import { ValidationError } from "../errors/errors.js";
import { EquipmentStatus, EQUIPMENT_STATUSES } from "../types.js";

function isEquipmentStatus(value: string): value is EquipmentStatus {
  return (EQUIPMENT_STATUSES as readonly string[]).includes(value);
}

export function validateStatus(status: string): EquipmentStatus {
  if (!isEquipmentStatus(status)) {
    throw new ValidationError("Invalid status");
  }

  return status;
}
