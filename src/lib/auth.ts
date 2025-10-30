import {betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
import {resetPassword} from "./actions";
import {prisma} from "@/lib/db"


export const auth = betterAuth({
	secret: process.env.BETTER_AUTH_SECRET,
	email: process.env.BETTER_AUTH_EMAIL,
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		sendResetPasswordEmail: resetPassword,
	},
	user: {
		changeEmail: {
			enabled: true,
		},
	},
});
