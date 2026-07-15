import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Basic Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // Find User
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        // Generate JWT
        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

export const activateAgent = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // Find agent or customer user
        const user = await prisma.user.findFirst({
            where: {
                email,
                role: {
                    in: ["AGENT", "CUSTOMER"]
                }
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No pre-registered account found with this email. Please contact the administrator."
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword
            }
        });

        return res.status(200).json({
            success: true,
            message: "Password set successfully! You can now log in."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required."
            });
        }

        // Fetch user from DB including password field
        const dbUser = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, dbUser.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedPassword }
        });

        return res.status(200).json({
            success: true,
            message: "Password changed successfully."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to change password."
        });
    }
};