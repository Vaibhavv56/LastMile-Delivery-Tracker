import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {

    const existingAdmin = await prisma.user.findUnique({
        where: {
            email: "admin@gmail.com"
        }
    });

    if (existingAdmin) {
        console.log("Admin already exists.");
        return;
    }

    const hashedPassword = await bcrypt.hash("admin", 10);

    await prisma.user.create({
        data: {
            firstName: "System",
            lastName: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            phone: "9999999999",
            role: UserRole.ADMIN,

            adminProfile: {
                create: {}
            }
        }
    });

    console.log("Admin created successfully.");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });