/*
  Warnings:

  - The primary key for the `AgentLocation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updatedAt` on the `AgentLocation` table. All the data in the column will be lost.
  - The `id` column on the `AgentLocation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Area` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Area` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Notification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Notification` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dropAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `pickupAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Order` table. All the data in the column will be lost.
  - The `id` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `assignedAgentId` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `actualWeight` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,2)`.
  - You are about to alter the column `volumetricWeight` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,2)`.
  - You are about to alter the column `billableWeight` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,2)`.
  - You are about to alter the column `deliveryCharge` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `codCharge` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `totalAmount` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - The primary key for the `RateCard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `RateCard` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `ratePerKg` on the `RateCard` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `codCharge` on the `RateCard` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - The primary key for the `Reschedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Reschedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `reassignedAgentId` column on the `Reschedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `TrackingHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updatedBy` on the `TrackingHistory` table. All the data in the column will be lost.
  - The `id` column on the `TrackingHistory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Zone` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Zone` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[pickupZoneId,dropZoneId,orderType]` on the table `RateCard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lastSeen` to the `AgentLocation` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `agentId` on the `AgentLocation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `pincode` to the `Area` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `zoneId` on the `Area` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `orderId` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `dropAddressId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heightCm` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lengthCm` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupAddressId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `widthCm` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `customerId` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `pickupZoneId` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `dropZoneId` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `RateCard` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `pickupZoneId` on the `RateCard` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `dropZoneId` on the `RateCard` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `orderId` on the `Reschedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedById` to the `TrackingHistory` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `orderId` on the `TrackingHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Zone` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('BIKE', 'SCOOTER', 'CAR', 'VAN');

-- DropForeignKey
ALTER TABLE "AgentLocation" DROP CONSTRAINT "AgentLocation_agentId_fkey";

-- DropForeignKey
ALTER TABLE "Area" DROP CONSTRAINT "Area_zoneId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_assignedAgentId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_dropZoneId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_pickupZoneId_fkey";

-- DropForeignKey
ALTER TABLE "RateCard" DROP CONSTRAINT "RateCard_dropZoneId_fkey";

-- DropForeignKey
ALTER TABLE "RateCard" DROP CONSTRAINT "RateCard_pickupZoneId_fkey";

-- DropForeignKey
ALTER TABLE "Reschedule" DROP CONSTRAINT "Reschedule_orderId_fkey";

-- DropForeignKey
ALTER TABLE "TrackingHistory" DROP CONSTRAINT "TrackingHistory_orderId_fkey";

-- AlterTable
ALTER TABLE "AgentLocation" DROP CONSTRAINT "AgentLocation_pkey",
DROP COLUMN "updatedAt",
ADD COLUMN     "lastSeen" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "agentId",
ADD COLUMN     "agentId" INTEGER NOT NULL,
ADD CONSTRAINT "AgentLocation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Area" DROP CONSTRAINT "Area_pkey",
ADD COLUMN     "pincode" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "zoneId",
ADD COLUMN     "zoneId" INTEGER NOT NULL,
ADD CONSTRAINT "Area_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSent" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "orderId",
ADD COLUMN     "orderId" INTEGER NOT NULL,
ALTER COLUMN "sentAt" DROP NOT NULL,
ALTER COLUMN "sentAt" DROP DEFAULT,
ADD CONSTRAINT "Notification_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "dropAddress",
DROP COLUMN "height",
DROP COLUMN "length",
DROP COLUMN "pickupAddress",
DROP COLUMN "width",
ADD COLUMN     "dropAddressId" INTEGER NOT NULL,
ADD COLUMN     "heightCm" DECIMAL(8,2) NOT NULL,
ADD COLUMN     "lengthCm" DECIMAL(8,2) NOT NULL,
ADD COLUMN     "pickupAddressId" INTEGER NOT NULL,
ADD COLUMN     "widthCm" DECIMAL(8,2) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "customerId",
ADD COLUMN     "customerId" INTEGER NOT NULL,
DROP COLUMN "assignedAgentId",
ADD COLUMN     "assignedAgentId" INTEGER,
DROP COLUMN "pickupZoneId",
ADD COLUMN     "pickupZoneId" INTEGER NOT NULL,
DROP COLUMN "dropZoneId",
ADD COLUMN     "dropZoneId" INTEGER NOT NULL,
ALTER COLUMN "actualWeight" SET DATA TYPE DECIMAL(8,2),
ALTER COLUMN "volumetricWeight" SET DATA TYPE DECIMAL(8,2),
ALTER COLUMN "billableWeight" SET DATA TYPE DECIMAL(8,2),
ALTER COLUMN "deliveryCharge" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "codCharge" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(10,2),
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RateCard" DROP CONSTRAINT "RateCard_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "pickupZoneId",
ADD COLUMN     "pickupZoneId" INTEGER NOT NULL,
DROP COLUMN "dropZoneId",
ADD COLUMN     "dropZoneId" INTEGER NOT NULL,
ALTER COLUMN "ratePerKg" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "codCharge" SET DATA TYPE DECIMAL(10,2),
ADD CONSTRAINT "RateCard_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Reschedule" DROP CONSTRAINT "Reschedule_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "orderId",
ADD COLUMN     "orderId" INTEGER NOT NULL,
DROP COLUMN "reassignedAgentId",
ADD COLUMN     "reassignedAgentId" INTEGER,
ADD CONSTRAINT "Reschedule_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TrackingHistory" DROP CONSTRAINT "TrackingHistory_pkey",
DROP COLUMN "updatedBy",
ADD COLUMN     "updatedById" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "orderId",
ADD COLUMN     "orderId" INTEGER NOT NULL,
ADD CONSTRAINT "TrackingHistory_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Zone" DROP CONSTRAINT "Zone_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Zone_pkey" PRIMARY KEY ("id");

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
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "currentZoneId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "zoneId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_userId_key" ON "CustomerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminProfile_userId_key" ON "AdminProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AgentProfile_userId_key" ON "AgentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AgentLocation_agentId_key" ON "AgentLocation"("agentId");

-- CreateIndex
CREATE INDEX "Area_zoneId_idx" ON "Area"("zoneId");

-- CreateIndex
CREATE INDEX "Order_customerId_idx" ON "Order"("customerId");

-- CreateIndex
CREATE INDEX "Order_assignedAgentId_idx" ON "Order"("assignedAgentId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_pickupZoneId_idx" ON "Order"("pickupZoneId");

-- CreateIndex
CREATE INDEX "Order_dropZoneId_idx" ON "Order"("dropZoneId");

-- CreateIndex
CREATE UNIQUE INDEX "RateCard_pickupZoneId_dropZoneId_orderType_key" ON "RateCard"("pickupZoneId", "dropZoneId", "orderType");

-- CreateIndex
CREATE INDEX "TrackingHistory_orderId_idx" ON "TrackingHistory"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "CustomerProfile" ADD CONSTRAINT "CustomerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminProfile" ADD CONSTRAINT "AdminProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentProfile" ADD CONSTRAINT "AgentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentProfile" ADD CONSTRAINT "AgentProfile_currentZoneId_fkey" FOREIGN KEY ("currentZoneId") REFERENCES "Zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Area" ADD CONSTRAINT "Area_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RateCard" ADD CONSTRAINT "RateCard_pickupZoneId_fkey" FOREIGN KEY ("pickupZoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RateCard" ADD CONSTRAINT "RateCard_dropZoneId_fkey" FOREIGN KEY ("dropZoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_assignedAgentId_fkey" FOREIGN KEY ("assignedAgentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pickupAddressId_fkey" FOREIGN KEY ("pickupAddressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_dropAddressId_fkey" FOREIGN KEY ("dropAddressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pickupZoneId_fkey" FOREIGN KEY ("pickupZoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_dropZoneId_fkey" FOREIGN KEY ("dropZoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingHistory" ADD CONSTRAINT "TrackingHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingHistory" ADD CONSTRAINT "TrackingHistory_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reschedule" ADD CONSTRAINT "Reschedule_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentLocation" ADD CONSTRAINT "AgentLocation_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "AgentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
