/*
  Warnings:

  - You are about to drop the column `clientName` on the `Outgoing` table. All the data in the column will be lost.
  - You are about to drop the column `supplier` on the `Outgoing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Outgoing" DROP COLUMN "clientName",
DROP COLUMN "supplier",
ADD COLUMN     "supplierId" TEXT;

-- AddForeignKey
ALTER TABLE "Incoming" ADD CONSTRAINT "Incoming_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outgoing" ADD CONSTRAINT "Outgoing_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outgoing" ADD CONSTRAINT "Outgoing_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
