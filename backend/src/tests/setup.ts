import { prisma } from "../database/prisma.js";

export const mochaHooks = {
  async beforeEach() {
    await prisma.$executeRaw`TRUNCATE TABLE "operations", "equipments", "rooms" RESTART IDENTITY`;
  },
  async afterAll() {
    await prisma.$disconnect();
  },
};
