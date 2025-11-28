/*
  Warnings:

  - A unique constraint covering the columns `[estimateId,materialId]` on the table `EstimateMaterial` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EstimateMaterial_estimateId_materialId_key" ON "EstimateMaterial"("estimateId", "materialId");
