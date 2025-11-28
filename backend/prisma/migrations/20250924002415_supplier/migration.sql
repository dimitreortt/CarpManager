/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "city" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "email" TEXT,
ADD COLUMN     "number" SERIAL NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_number_key" ON "Supplier"("number");
