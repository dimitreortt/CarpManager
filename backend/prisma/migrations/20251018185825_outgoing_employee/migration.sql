/*
  Warnings:

  - You are about to drop the column `installmentReceived` on the `Estimate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Estimate" DROP COLUMN "installmentReceived";

-- AlterTable
ALTER TABLE "Outgoing" ADD COLUMN     "employeeId" TEXT;

-- AddForeignKey
ALTER TABLE "Outgoing" ADD CONSTRAINT "Outgoing_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
