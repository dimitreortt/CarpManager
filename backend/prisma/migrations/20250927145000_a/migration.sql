/*
  Warnings:

  - You are about to drop the column `estimate` on the `Incoming` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Incoming" DROP COLUMN "estimate",
ADD COLUMN     "estimateId" TEXT;

-- AddForeignKey
ALTER TABLE "Incoming" ADD CONSTRAINT "Incoming_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "Estimate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
