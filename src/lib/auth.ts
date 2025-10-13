import {betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
export const auth = betterAuth({
	secret: process.env.BETTER_AUTH_SECRET,
	email: process.env.BETTER_AUTH_EMAIL,
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
	},
	user: {
		changeEmail: {
			enabled: true,
		},
		changePassword: {
			enabled: true,
		}
	}
});

