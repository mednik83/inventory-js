/*
  Warnings:

  - Changed the type of `status` on the `equipments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `operations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('active', 'inactive', 'written_off');

-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('create', 'update', 'delete', 'move', 'write_off');

-- AlterTable
ALTER TABLE "equipments" DROP COLUMN "status",
ADD COLUMN     "status" "EquipmentStatus" NOT NULL;

-- AlterTable
ALTER TABLE "operations" DROP COLUMN "type",
ADD COLUMN     "type" "OperationType" NOT NULL;
