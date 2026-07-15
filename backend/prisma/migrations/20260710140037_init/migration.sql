/*
  Warnings:

  - You are about to drop the column `dropAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `pickupAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `availability` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `currentZoneId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `licenseNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleType` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,zoneId]` on the table `Area` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dropAddressLine` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupAddressLine` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AgentLocation" DROP CONSTRAINT "AgentLocation_agentId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_currentZoneId_fkey";

-- AlterTable
ALTER TABLE "AgentLocation" ALTER COLUMN "lastSeen" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "dropAddress",
DROP COLUMN "pickupAddress",
ADD COLUMN     "dropAddressLine" TEXT NOT NULL,
ADD COLUMN     "pickupAddressLine" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "availability",
DROP COLUMN "currentZoneId",
DROP COLUMN "licenseNumber",
DROP COLUMN "vehicleNumber",
DROP COLUMN "vehicleType";

-- CreateTable
CREATE TABLE "CustomerProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyName" TEXT,
    "gstNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "vehicleType" "VehicleType" NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "currentZoneId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_userId_key" ON "CustomerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminProfile_userId_key" ON "AdminProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AgentProfile_userId_key" ON "AgentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Area_name_zoneId_key" ON "Area"("name", "zoneId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_orderId_idx" ON "Notification"("orderId");

-- CreateIndex
CREATE INDEX "RateCard_pickupZoneId_idx" ON "RateCard"("pickupZoneId");

-- CreateIndex
CREATE INDEX "RateCard_dropZoneId_idx" ON "RateCard"("dropZoneId");

-- CreateIndex
CREATE INDEX "Reschedule_orderId_idx" ON "Reschedule"("orderId");

-- AddForeignKey
ALTER TABLE "CustomerProfile" ADD CONSTRAINT "CustomerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminProfile" ADD CONSTRAINT "AdminProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentProfile" ADD CONSTRAINT "AgentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentProfile" ADD CONSTRAINT "AgentProfile_currentZoneId_fkey" FOREIGN KEY ("currentZoneId") REFERENCES "Zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reschedule" ADD CONSTRAINT "Reschedule_reassignedAgentId_fkey" FOREIGN KEY ("reassignedAgentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentLocation" ADD CONSTRAINT "AgentLocation_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "AgentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
