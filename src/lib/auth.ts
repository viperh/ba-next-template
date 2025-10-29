import {betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
import {PrismaClient} from "@prisma/client";
import {resetPassword} from "./actions";
import {admin as adminPlugin} from "better-auth/plugins/admin"

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
		sendResetPassword: resetPassword,
	},
	changePassword: {
		enabled: true,
	},
	user: {
		changeEmail: {
			enabled: true,
		}
	},
	
	plugins: [
		adminPlugin({
			defaultRole: "user",
			adminRoles: ["admin"],
			ac: undefined,
		})
	]
	
});
