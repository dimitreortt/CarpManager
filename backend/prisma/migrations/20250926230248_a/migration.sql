/*
  Warnings:

  - You are about to drop the column `client` on the `Estimate` table. All the data in the column will be lost.
  - You are about to drop the column `estimateId` on the `Trip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Estimate" DROP COLUMN "client",
ADD COLUMN     "clientId" TEXT,
ADD COLUMN     "precutCost" DOUBLE PRECISION,
ALTER COLUMN "totalValue" DROP NOT NULL,
ALTER COLUMN "laborCost" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "dueDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "estimateId";

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Estimate" ADD CONSTRAINT "Estimate_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
