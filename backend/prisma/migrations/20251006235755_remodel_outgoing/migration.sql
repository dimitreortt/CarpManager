/*
  Warnings:

  - You are about to drop the column `clientId` on the `Outgoing` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Outgoing` table. All the data in the column will be lost.
  - You are about to drop the column `installmentAmount` on the `Outgoing` table. All the data in the column will be lost.
  - You are about to drop the column `installments` on the `Outgoing` table. All the data in the column will be lost.
  - You are about to drop the column `paidAmount` on the `Outgoing` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseAmount` on the `Outgoing` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseMethod` on the `Outgoing` table. All the data in the column will be lost.
  - You are about to drop the column `purpose` on the `Outgoing` table. All the data in the column will be lost.
  - You are about to drop the column `reference` on the `Outgoing` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Outgoing` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Outgoing" DROP CONSTRAINT "Outgoing_clientId_fkey";

-- AlterTable
ALTER TABLE "Outgoing" DROP COLUMN "clientId",
DROP COLUMN "dueDate",
DROP COLUMN "installmentAmount",
DROP COLUMN "installments",
DROP COLUMN "paidAmount",
DROP COLUMN "purchaseAmount",
DROP COLUMN "purchaseMethod",
DROP COLUMN "purpose",
DROP COLUMN "reference",
DROP COLUMN "totalAmount",
ADD COLUMN     "amount" DOUBLE PRECISION,
ADD COLUMN     "paymentMethod" TEXT;
