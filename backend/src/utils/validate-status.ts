import { EquipmentStatusZod } from "../schemas/zod.js";
import { EquipmentStatus } from "../types.js";

export function validateStatus(status: string): EquipmentStatus {
  return EquipmentStatusZod.parse(status.trim());
}
