import { ValidationError } from "../errors/errors.js";

export function validateLimit(limit: unknown) {
  if (limit === undefined) {
    return undefined;
  }
  let NumLimit: number;
  if (typeof limit === "string" || typeof limit === "number") {
    NumLimit = Number(limit);
  } else {
    throw new ValidationError("Invalid limit");
  }

  if (!Number.isInteger(NumLimit) || NumLimit <= 0) {
    throw new ValidationError("Invalid limit");
  }

  return NumLimit;
}
