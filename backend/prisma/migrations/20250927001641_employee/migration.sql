/*
  Warnings:

  - Made the column `name` on table `Quote` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Quote" ALTER COLUMN "number" DROP NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "number" SERIAL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "position" TEXT,
    "department" TEXT,
    "hireDate" TEXT,
    "salary" DOUBLE PRECISION,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "bankAccount" TEXT,
    "bankBranch" TEXT,
    "bankCode" TEXT,
    "notes" TEXT,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_number_key" ON "Employee"("number");
