import { ValidationError } from "../errors/errors.js";

export function validateId(id: unknown) {
  let numericId: number;
  if (typeof id === "string" || typeof id === "number") {
    numericId = Number(id);
  } else {
    throw new ValidationError("Invalid ID");
  }

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new ValidationError("Invalid ID");
  }

  return numericId;
}
