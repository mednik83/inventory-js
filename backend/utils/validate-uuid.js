import { validate as uuidValidate, version as uuidVersion } from "uuid";
import { ValidationError } from "../errors/errors.js";

export function validateUuid(uuid) {
  if (!uuidValidate(uuid)) {
    throw new ValidationError("Invalid uuid");
  }

  return uuid;
}
