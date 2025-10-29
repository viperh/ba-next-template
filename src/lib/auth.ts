import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { resetPassword } from "./actions";

const url = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString: url });

const prisma = new PrismaClient({ adapter });
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
