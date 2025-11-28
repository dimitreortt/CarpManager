/*
  Warnings:

  - You are about to drop the `_EstimateToMaterial` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EstimateToMaterial" DROP CONSTRAINT "_EstimateToMaterial_A_fkey";

-- DropForeignKey
ALTER TABLE "_EstimateToMaterial" DROP CONSTRAINT "_EstimateToMaterial_B_fkey";

-- DropTable
DROP TABLE "_EstimateToMaterial";

-- CreateTable
CREATE TABLE "EstimateMaterial" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "estimateId" TEXT,
    "materialId" TEXT,

    CONSTRAINT "EstimateMaterial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EstimateMaterial" ADD CONSTRAINT "EstimateMaterial_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "Estimate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstimateMaterial" ADD CONSTRAINT "EstimateMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;
