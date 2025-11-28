/*
  Warnings:

  - You are about to drop the column `estimate` on the `Quote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "estimate",
ADD COLUMN     "estimateId" TEXT;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "Estimate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
