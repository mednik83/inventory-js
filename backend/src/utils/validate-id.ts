import { IdZod } from "../schemas/zod.js";

export function validateId(id: unknown): number {
  const numericId: number = IdZod.parse(id);
  return numericId;
}
