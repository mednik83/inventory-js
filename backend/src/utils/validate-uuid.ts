import { UuidZod } from "../schemas/zod.js";

export function validateUuid(uuid: unknown): string {
  return UuidZod.parse(uuid);
}
