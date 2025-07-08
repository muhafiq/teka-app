import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { authConfig } from "./auth.config";

async function getUser(phoneNumber) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber));
    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const authOptions = {
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            phoneNumber: z.string(),
            password: z.string().min(8),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { phoneNumber, password } = parsedCredentials.data;
          const user = await getUser(phoneNumber);

          if (!user) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) return user;
        }

        return null;
      },
    }),
  ],
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);