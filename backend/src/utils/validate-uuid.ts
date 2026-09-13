import { validate as uuidValidate } from "uuid";
import { ValidationError } from "../errors/errors.js";

export function validateUuid(uuid: string) {
  if (!uuidValidate(uuid)) {
    throw new ValidationError("Invalid uuid");
  }

  return uuid;
}
