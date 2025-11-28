-- CreateTable
CREATE TABLE "Estimate" (
    "id" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "number" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "laborCost" DOUBLE PRECISION NOT NULL,
    "installmentReceived" DOUBLE PRECISION,
    "status" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Estimate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "number" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "numberOfTolls" INTEGER NOT NULL,
    "costOfTolls" DOUBLE PRECISION NOT NULL,
    "numberOfLunches" INTEGER NOT NULL,
    "costOfLunches" DOUBLE PRECISION NOT NULL,
    "costOfFuel" DOUBLE PRECISION NOT NULL,
    "numberOfServices" INTEGER NOT NULL,
    "costPerService" DOUBLE PRECISION,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "estimateId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripServiceCost" (
    "id" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION,
    "cost" DOUBLE PRECISION,
    "tripId" TEXT,
    "estimateId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TripServiceCost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EstimateToMaterial" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EstimateToMaterial_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Estimate_number_key" ON "Estimate"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Trip_number_key" ON "Trip"("number");

-- CreateIndex
CREATE INDEX "_EstimateToMaterial_B_index" ON "_EstimateToMaterial"("B");

-- AddForeignKey
ALTER TABLE "TripServiceCost" ADD CONSTRAINT "TripServiceCost_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripServiceCost" ADD CONSTRAINT "TripServiceCost_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "Estimate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EstimateToMaterial" ADD CONSTRAINT "_EstimateToMaterial_A_fkey" FOREIGN KEY ("A") REFERENCES "Estimate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EstimateToMaterial" ADD CONSTRAINT "_EstimateToMaterial_B_fkey" FOREIGN KEY ("B") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
