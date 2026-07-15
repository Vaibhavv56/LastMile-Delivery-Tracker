import prisma from "../config/prisma.js";

export const createZoneService = async (data) => {

    const existingZone = await prisma.zone.findUnique({
        where: {
            name: data.name
        }
    });

    if (existingZone) {
        throw new Error("Zone already exists");
    }

    return await prisma.zone.create({
        data: {
            name: data.name,
            description: data.description
        }
    });

};

export const getAllZonesService = async () => {

    return await prisma.zone.findMany({
        orderBy: {
            name: "asc"
        }
    });

};

export const getZoneByIdService = async (id) => {

    return await prisma.zone.findUnique({
        where: {
            id
        }
    });

};

export const updateZoneService = async (id, data) => {

    return await prisma.zone.update({
        where: {
            id
        },
        data: {
            name: data.name,
            description: data.description
        }
    });

};

export const deleteZoneService = async (id) => {

    const areaCount = await prisma.area.count({
        where: {
            zoneId: id
        }
    });

    if (areaCount > 0) {
        throw new Error("Cannot delete zone. Areas exist inside this zone.");
    }

    return await prisma.zone.delete({
        where: {
            id
        }
    });

};