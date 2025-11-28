-- DropForeignKey
ALTER TABLE "EstimateMaterial" DROP CONSTRAINT "EstimateMaterial_estimateId_fkey";

-- DropForeignKey
ALTER TABLE "EstimateMaterial" DROP CONSTRAINT "EstimateMaterial_materialId_fkey";

-- AddForeignKey
ALTER TABLE "EstimateMaterial" ADD CONSTRAINT "EstimateMaterial_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "Estimate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstimateMaterial" ADD CONSTRAINT "EstimateMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
