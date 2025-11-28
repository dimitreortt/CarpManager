-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Incoming" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Outgoing" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "TripServiceCost" ADD COLUMN     "companyId" TEXT;

-- CreateIndex
CREATE INDEX "Employee_companyId_idx" ON "Employee"("companyId");

-- CreateIndex
CREATE INDEX "Incoming_companyId_idx" ON "Incoming"("companyId");

-- CreateIndex
CREATE INDEX "Material_companyId_idx" ON "Material"("companyId");

-- CreateIndex
CREATE INDEX "Outgoing_companyId_idx" ON "Outgoing"("companyId");

-- CreateIndex
CREATE INDEX "Supplier_companyId_idx" ON "Supplier"("companyId");

-- CreateIndex
CREATE INDEX "Trip_companyId_idx" ON "Trip"("companyId");

-- CreateIndex
CREATE INDEX "TripServiceCost_companyId_idx" ON "TripServiceCost"("companyId");
