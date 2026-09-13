import { validate as uuidValidate } from "uuid";
import { ValidationError } from "../errors/errors.js";

export function validateUuid(uuid: unknown) {
  if (typeof uuid !== "string") {
    throw new ValidationError("Invalid uuid");
  }

  if (!uuidValidate(uuid)) {
    throw new ValidationError("Invalid uuid");
  }

  return uuid;
}
