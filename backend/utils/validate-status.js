import { ValidationError } from "../errors/errors.js";

export function validateStatus(status) {
  const allowedStatuses = ["active", "inactive", "written_off"];

  if (!allowedStatuses.includes(status)) {
    throw new ValidationError("Invalid status");
  }

  return status;
}
