-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "companyId" TEXT;

-- CreateIndex
CREATE INDEX "Quote_companyId_idx" ON "Quote"("companyId");
