import { prisma } from "../database/prisma.js";
import { Operation } from "../types.js";

class OperationRepository {
  async create(
    operation: Pick<Operation, "equipment_id" | "type" | "comment">,
  ): Promise<Operation> {
    return await prisma.operation.create({ data: operation });
  }

  async getByEquipmentId(equipmentId: number): Promise<Operation[]> {
    return await prisma.operation.findMany({
      where: { equipment_id: equipmentId },
      orderBy: [{ created_at: "desc" }, { id: "desc" }],
    });
  }

  async deleteByEquipmentId(equipmentId: number): Promise<{ count: number }> {
    return await prisma.operation.deleteMany({
      where: { equipment_id: equipmentId },
    });
  }
}

export const operationRepository = new OperationRepository();
