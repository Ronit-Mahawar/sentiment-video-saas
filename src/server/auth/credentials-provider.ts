import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { loginSchema } from "~/schemas/auth";
import { db } from "~/server/db";

export const credentialsProvider = Credentials({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    try {
      const { email, password } = await loginSchema.parse(credentials);

      const user = await db.user.findUnique({
        where: { email },
      });

      if (!user || !user.password) {
        return null;
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return null;
      }

      return {
        id: user.id,
        name: user.name || null,
        email: user.email || null,
      };
    } catch {
      return null;
    }
  },
});
