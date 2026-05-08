import { ValidationError } from "../errors/errors.js";
import { operationRepository } from "../repositories/operation.repository.js";
import { validateId } from "../utils/validate-id.js";

function validateOperation(operation, comment) {
  const allowedOperations = [
    "created",
    "updated",
    "moved",
    "written_off",
    "deleted",
  ];

  if (!allowedOperations.includes(operation)) {
    throw new ValidationError("This operation is not allowed");
  }

  if (comment === null || comment === undefined) {
    return {
      type: operation,
      comment: null,
    };
  }

  const validComment = String(comment).trim();

  return {
    type: operation,
    comment: validComment,
  };
}

class OperationService {
  create(equipmentId, operation, comment = null) {
    const validOperation = validateOperation(operation, comment);
    const validEquipmentId = validateId(equipmentId);
    return operationRepository.create(
      validEquipmentId,
      validOperation.type,
      validOperation.comment,
    );
  }

  getByEquipmentId(equipmentId) {
    const validEquipmentId = validateId(equipmentId);
    return operationRepository.getByEquipmentId(validEquipmentId);
  }
}

export const operationService = new OperationService();
