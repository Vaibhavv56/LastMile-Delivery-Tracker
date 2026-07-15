import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";

export const createCustomerService = async (data) => {

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

    const rawPassword = data.password || (Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10));
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    return await prisma.user.create({

        data: {

            firstName: data.firstName,

            lastName: data.lastName,

            email: data.email,

            password: hashedPassword,

            phone: data.phone,

            role: UserRole.CUSTOMER,

            customerProfile: {

                create: {

                    companyName: data.companyName,

                    gstNumber: data.gstNumber

                }

            }

        },

        include: {

            customerProfile: true

        }

    });

};

export const getAllCustomersService = async () => {

    return await prisma.user.findMany({

        where: {

            role: UserRole.CUSTOMER

        },

        include: {

            customerProfile: true

        },

        orderBy: {

            createdAt: "desc"

        }

    });

};

export const getCustomerByIdService = async (id) => {

    return await prisma.user.findUnique({

        where: {

            id

        },

        include: {

            customerProfile: true

        }

    });

};

export const updateCustomerService = async (id, data) => {

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

            customerProfile: {

                update: {

                    companyName: data.companyName,

                    gstNumber: data.gstNumber

                }

            }

        },

        include: {

            customerProfile: true

        }

    });

};

export const deleteCustomerService = async (id) => {

    return await prisma.user.update({

        where: {

            id

        },

        data: {

            isActive: false

        }

    });

};