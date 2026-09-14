import { ValidationError } from "../errors/errors.js";
import { operationRepository } from "../repositories/operation.repository.js";
import {
  ALLOWED_OPERATIONS,
  type Operation,
  type OperationType,
} from "../types.js";
import { validateId } from "../utils/validate-id.js";

function isOperationType(value: string): value is OperationType {
  return (ALLOWED_OPERATIONS as readonly string[]).includes(value);
}

function validateOperation(
  operation: string,
  comment?: string | null,
): Pick<Operation, "type" | "comment"> {
  if (!isOperationType(operation)) {
    throw new ValidationError(
      `Operation "${String(operation)}" is not allowed. Expected one of: ${ALLOWED_OPERATIONS.join(", ")}.`,
    );
  }

  const trimmed = comment?.trim();

  return {
    type: operation,
    comment: trimmed || null,
  };
}

class OperationService {
  create(operation: {
    equipment_id: number;
    type: string;
    comment?: string | null;
  }) {
    const validOperation = validateOperation(operation.type, operation.comment);
    const validEquipmentId = validateId(operation.equipment_id);
    return operationRepository.create({
      equipment_id: validEquipmentId,
      type: validOperation.type,
      comment: validOperation.comment,
    });
  }

  getByEquipmentId(equipmentId: unknown): Operation[] {
    const validEquipmentId: number = validateId(equipmentId);
    const operations: Operation[] | undefined =
      operationRepository.getByEquipmentId(validEquipmentId);

    if (!operations) {
      return [];
    }

    return operations;
  }
}

export const operationService = new OperationService();
