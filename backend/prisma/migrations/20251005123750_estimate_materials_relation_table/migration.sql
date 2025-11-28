-- DropForeignKey
ALTER TABLE "TripServiceCost" DROP CONSTRAINT "TripServiceCost_tripId_fkey";

-- AddForeignKey
ALTER TABLE "TripServiceCost" ADD CONSTRAINT "TripServiceCost_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
