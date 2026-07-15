import prisma from "../config/prisma.js";

export const createRateService = async (data) => {

    const pickupZone = await prisma.zone.findUnique({
        where: { id: data.pickupZoneId }
    });

    if (!pickupZone) {
        throw new Error("Pickup zone not found.");
    }

    const dropZone = await prisma.zone.findUnique({
        where: { id: data.dropZoneId }
    });

    if (!dropZone) {
        throw new Error("Drop zone not found.");
    }

    const existingRate = await prisma.rateCard.findFirst({
        where: {
            pickupZoneId: data.pickupZoneId,
            dropZoneId: data.dropZoneId,
            orderType: data.orderType
        }
    });

    if (existingRate) {
        throw new Error("Rate card already exists.");
    }

    return await prisma.rateCard.create({
        data: {
            pickupZoneId: data.pickupZoneId,
            dropZoneId: data.dropZoneId,
            orderType: data.orderType,
            ratePerKg: data.ratePerKg,
            codCharge: data.codCharge
        }
    });
};

export const getAllRatesService = async () => {

    return await prisma.rateCard.findMany({
        include: {
            pickupZone: true,
            dropZone: true
        },
        orderBy: {
            effectiveFrom: "desc"
        }
    });

};

export const getRateByIdService = async (id) => {

    return await prisma.rateCard.findUnique({
        where: { id },
        include: {
            pickupZone: true,
            dropZone: true
        }
    });

};

export const updateRateService = async (id, data) => {

    return await prisma.rateCard.update({
        where: { id },
        data: {
            pickupZoneId: data.pickupZoneId,
            dropZoneId: data.dropZoneId,
            orderType: data.orderType,
            ratePerKg: data.ratePerKg,
            codCharge: data.codCharge
        }
    });

};

export const deleteRateService = async (id) => {

    return await prisma.rateCard.delete({
        where: { id }
    });

};