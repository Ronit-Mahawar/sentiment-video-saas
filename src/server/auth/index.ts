import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { cache } from "react";

import { authConfig } from "./auth.config";
import { credentialsProvider } from "./credentials-provider";
import { db } from "~/server/db";

const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [credentialsProvider],
});

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
