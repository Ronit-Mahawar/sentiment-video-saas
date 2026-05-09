import NextAuth from "next-auth";

import { authConfig } from "./server/auth/auth.config";

export default NextAuth(authConfig).auth((req) => {
  const isAuthenticated = !!req.auth;

  if (!isAuthenticated) {
    const newUrl = new URL("/login", req.url);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/"],
};
