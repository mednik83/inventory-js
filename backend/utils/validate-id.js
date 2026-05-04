import { ValidationError } from "../errors/errors.js";

export function validateId(id) {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new ValidationError("Invalid ID");
  }

  return numericId;
}
