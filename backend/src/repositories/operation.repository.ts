import { prisma } from "../database/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import { Operation } from "../types.js";

class OperationRepository {
  async create(
    operation: Pick<Operation, "equipment_id" | "type" | "comment">,
    db: Prisma.TransactionClient = prisma,
  ): Promise<Operation> {
    return await db.operation.create({ data: operation });
  }

  async getByEquipmentId(equipmentId: number): Promise<Operation[]> {
    return await prisma.operation.findMany({
      where: { equipment_id: equipmentId },
      orderBy: [{ created_at: "desc" }, { id: "desc" }],
    });
  }

  async deleteByEquipmentId(
    equipmentId: number,
    db: Prisma.TransactionClient = prisma,
  ): Promise<{ count: number }> {
    return await db.operation.deleteMany({
      where: { equipment_id: equipmentId },
    });
  }
}

export const operationRepository = new OperationRepository();
