import prisma from "../config/prisma.js";

export const createAreaService = async (data) => {

    const zone = await prisma.zone.findUnique({
        where: {
            id: data.zoneId
        }
    });

    if (!zone) {
        throw new Error("Zone not found");
    }

    const existingArea = await prisma.area.findFirst({
        where: {
            name: data.name,
            zoneId: data.zoneId
        }
    });

    if (existingArea) {
        throw new Error("Area already exists in this zone");
    }

    return await prisma.area.create({
        data: {
            name: data.name,
            pincode: data.pincode,
            latitude: data.latitude,
            longitude: data.longitude,
            zoneId: data.zoneId
        }
    });

};

export const getAllAreasService = async () => {

    return await prisma.area.findMany({
        include: {
            zone: true
        },
        orderBy: {
            name: "asc"
        }
    });

};

export const getAreaByIdService = async (id) => {

    return await prisma.area.findUnique({
        where: {
            id
        },
        include: {
            zone: true
        }
    });

};

export const updateAreaService = async (id, data) => {

    return await prisma.area.update({
        where: {
            id
        },
        data
    });

};

export const deleteAreaService = async (id) => {

    return await prisma.area.delete({
        where: {
            id
        }
    });

};