import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import { generateToken } from '../lib/jwt.js';

const SALT_ROUNDS = 10;

export const authService = {
    async signup(email, username, password, firstName, lastName) {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existingUser) {
            throw {
                status: 409,
                message: email === existingUser.email ? 'Email already registered' : 'Username already taken',
            };
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                firstName,
                lastName,
            },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
            },
        });

        const token = generateToken(user.id);

        return { user, token };
    },

    async login(email, password) {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw {
                status: 401,
                message: 'Invalid credentials',
            };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw {
                status: 401,
                message: 'Invalid credentials',
            };
        }

        const token = generateToken(user.id);

        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            token,
        };
    },

    async getUserProfile(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                city: true,
                country: true,
                additionalInfo: true,
                profileImage: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw { status: 404, message: 'User not found' };
        }

        return user;
    },

    async updateProfile(userId, data) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(data.firstName && { firstName: data.firstName }),
                ...(data.lastName && { lastName: data.lastName }),
                ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber }),
                ...(data.city !== undefined && { city: data.city }),
                ...(data.country !== undefined && { country: data.country }),
                ...(data.additionalInfo !== undefined && { additionalInfo: data.additionalInfo }),
            },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                city: true,
                country: true,
                additionalInfo: true,
            },
        });

        return user;
    },
};
