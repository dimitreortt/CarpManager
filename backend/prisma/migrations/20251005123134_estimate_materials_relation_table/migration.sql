/*
  Warnings:

  - The primary key for the `EstimateMaterial` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `EstimateMaterial` table. All the data in the column will be lost.
  - Made the column `estimateId` on table `EstimateMaterial` required. This step will fail if there are existing NULL values in that column.
  - Made the column `materialId` on table `EstimateMaterial` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "EstimateMaterial" DROP CONSTRAINT "EstimateMaterial_estimateId_fkey";

-- DropForeignKey
ALTER TABLE "EstimateMaterial" DROP CONSTRAINT "EstimateMaterial_materialId_fkey";

-- DropIndex
DROP INDEX "EstimateMaterial_estimateId_materialId_key";

-- AlterTable
ALTER TABLE "EstimateMaterial" DROP CONSTRAINT "EstimateMaterial_pkey",
DROP COLUMN "id",
ALTER COLUMN "estimateId" SET NOT NULL,
ALTER COLUMN "materialId" SET NOT NULL,
ADD CONSTRAINT "EstimateMaterial_pkey" PRIMARY KEY ("estimateId", "materialId");

-- AddForeignKey
ALTER TABLE "EstimateMaterial" ADD CONSTRAINT "EstimateMaterial_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "Estimate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstimateMaterial" ADD CONSTRAINT "EstimateMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
