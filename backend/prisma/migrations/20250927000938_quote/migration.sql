-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "number" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "TripServiceCost" ADD COLUMN     "status" TEXT;

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "number" SERIAL,
    "name" TEXT,
    "amount" DOUBLE PRECISION,
    "description" TEXT,
    "date" TEXT,
    "supplier" TEXT,
    "estimate" TEXT,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quote_number_key" ON "Quote"("number");
