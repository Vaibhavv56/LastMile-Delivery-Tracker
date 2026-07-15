import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";

export const createAgentService = async (data) => {

    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    });

    if (existingUser) {
        throw new Error("Email already exists.");
    }

    const existingPhone = await prisma.user.findUnique({
        where: {
            phone: data.phone
        }
    });

    if (existingPhone) {
        throw new Error("Phone number already exists.");
    }

    const zone = await prisma.zone.findUnique({
        where: {
            id: data.currentZoneId
        }
    });

    if (!zone) {
        throw new Error("Zone not found.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await prisma.user.create({

        data: {

            firstName: data.firstName,

            lastName: data.lastName,

            email: data.email,

            password: hashedPassword,

            phone: data.phone,

            role: UserRole.AGENT,

            agentProfile: {

                create: {

                    vehicleNumber: data.vehicleNumber,

                    vehicleType: data.vehicleType,

                    licenseNumber: data.licenseNumber,

                    currentZoneId: data.currentZoneId,

                    availability: true

                }

            }

        },

        include: {

            agentProfile: {

                include: {

                    currentZone: true

                }

            }

        }

    });

};

export const getAllAgentsService = async () => {

    return await prisma.user.findMany({

        where: {

            role: UserRole.AGENT

        },

        include: {

            agentProfile: {

                include: {

                    currentZone: true,

                    location: true

                }

            }

        },

        orderBy: {

            createdAt: "desc"

        }

    });

};

export const getAgentByIdService = async (id) => {

    return await prisma.user.findUnique({

        where: {

            id

        },

        include: {

            agentProfile: {

                include: {

                    currentZone: true

                }

            }

        }

    });

};

export const updateAgentService = async (id, data) => {

    if (data.phone) {
        const existingPhone = await prisma.user.findFirst({
            where: {
                phone: data.phone,
                id: { not: id }
            }
        });
        if (existingPhone) {
            throw new Error("Phone number already exists.");
        }
    }

    return await prisma.user.update({

        where: {

            id

        },

        data: {

            firstName: data.firstName,

            lastName: data.lastName,

            phone: data.phone,

            agentProfile: {

                update: {

                    vehicleNumber: data.vehicleNumber,

                    vehicleType: data.vehicleType,

                    licenseNumber: data.licenseNumber,

                    currentZoneId: data.currentZoneId

                }

            }

        },

        include: {

            agentProfile: {

                include: {

                    currentZone: true

                }

            }

        }

    });

};

export const deleteAgentService = async (id) => {

    return await prisma.user.update({

        where: {

            id

        },

        data: {

            isActive: false

        }

    });

};

export const updateAvailabilityService = async (id, availability) => {

    return await prisma.agentProfile.update({

        where: {

            userId: id

        },

        data: {

            availability

        }

    });

};