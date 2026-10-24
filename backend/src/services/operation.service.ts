import * as z from "zod";
import { operationRepository } from "../repositories/operation.repository.js";
import { IdZod, OperationZod } from "../schemas/zod.js";
import { type Operation } from "../types.js";

class OperationService {
  async create(operation: {
    equipment_id: number;
    type: string;
    comment?: string | null;
  }) {
    const validOperation: z.infer<typeof OperationZod> = OperationZod.parse({
      type: operation.type,
      comment: operation.comment,
    });
    const validEquipmentId = IdZod.parse(operation.equipment_id);
    return await operationRepository.create({
      equipment_id: validEquipmentId,
      type: validOperation.type,
      comment: validOperation.comment || null,
    });
  }

  async getByEquipmentId(equipmentId: unknown): Promise<Operation[]> {
    const validEquipmentId: number = IdZod.parse(equipmentId);
    const operations: Operation[] =
      await operationRepository.getByEquipmentId(validEquipmentId);

    return operations;
  }
}

export const operationService = new OperationService();
