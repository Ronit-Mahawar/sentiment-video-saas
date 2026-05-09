import { type DefaultSession, type NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config (no Prisma / Node-only APIs).
 * Used by middleware. Full app auth merges in adapter + Credentials in `index.ts`.
 *
 * @see https://authjs.dev/guides/edge-compatibility
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  providers: [],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub!,
      },
    }),
  },
} satisfies NextAuthConfig;
