/*
  Warnings:

  - You are about to drop the column `dropAddressId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `pickupAddressId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdminProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AgentProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerProfile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dropAddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dropPincode` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupAddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupPincode` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_zoneId_fkey";

-- DropForeignKey
ALTER TABLE "AdminProfile" DROP CONSTRAINT "AdminProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "AgentLocation" DROP CONSTRAINT "AgentLocation_agentId_fkey";

-- DropForeignKey
ALTER TABLE "AgentProfile" DROP CONSTRAINT "AgentProfile_currentZoneId_fkey";

-- DropForeignKey
ALTER TABLE "AgentProfile" DROP CONSTRAINT "AgentProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerProfile" DROP CONSTRAINT "CustomerProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_dropAddressId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_pickupAddressId_fkey";

-- DropIndex
DROP INDEX "User_email_idx";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "dropAddressId",
DROP COLUMN "pickupAddressId",
ADD COLUMN     "dropAddress" TEXT NOT NULL,
ADD COLUMN     "dropPincode" TEXT NOT NULL,
ADD COLUMN     "pickupAddress" TEXT NOT NULL,
ADD COLUMN     "pickupPincode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "availability" BOOLEAN,
ADD COLUMN     "currentZoneId" INTEGER,
ADD COLUMN     "licenseNumber" TEXT,
ADD COLUMN     "vehicleNumber" TEXT,
ADD COLUMN     "vehicleType" "VehicleType";

-- DropTable
DROP TABLE "Address";

-- DropTable
DROP TABLE "AdminProfile";

-- DropTable
DROP TABLE "AgentProfile";

-- DropTable
DROP TABLE "CustomerProfile";

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currentZoneId_fkey" FOREIGN KEY ("currentZoneId") REFERENCES "Zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentLocation" ADD CONSTRAINT "AgentLocation_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
