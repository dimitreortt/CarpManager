-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Estimate" ADD COLUMN     "companyId" TEXT;

-- CreateIndex
CREATE INDEX "Client_companyId_idx" ON "Client"("companyId");

-- CreateIndex
CREATE INDEX "Estimate_companyId_idx" ON "Estimate"("companyId");
