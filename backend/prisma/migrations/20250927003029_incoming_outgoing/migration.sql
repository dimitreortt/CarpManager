-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "number" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Incoming" (
    "id" TEXT NOT NULL,
    "number" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "date" TEXT,
    "clientId" TEXT,
    "paymentMethod" TEXT,
    "installmentNumber" INTEGER,
    "numberOfInstallments" INTEGER,
    "notes" TEXT,
    "estimate" TEXT,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Incoming_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outgoing" (
    "id" TEXT NOT NULL,
    "number" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "reference" TEXT,
    "purchaseMethod" TEXT,
    "installments" INTEGER,
    "totalAmount" DOUBLE PRECISION,
    "installmentAmount" DOUBLE PRECISION,
    "description" TEXT,
    "purpose" TEXT,
    "category" TEXT,
    "clientId" TEXT,
    "clientName" TEXT,
    "supplier" TEXT,
    "purchaseAmount" DOUBLE PRECISION,
    "dueDate" TIMESTAMP(3),
    "paidAmount" DOUBLE PRECISION,
    "accountType" TEXT,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Outgoing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Incoming_number_key" ON "Incoming"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Outgoing_number_key" ON "Outgoing"("number");
