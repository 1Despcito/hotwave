import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/en/auth/login",
    },
  }
);

export default function proxy(req: NextRequest) {
  // Check if the route is an admin route (e.g., /ar/admin or /en/admin)
  const isAdminPath = RegExp(
    `^(/(${routing.locales.join("|")}))?/admin`,
    "i"
  ).test(req.nextUrl.pathname);

  if (isAdminPath) {
    return (authMiddleware as (req: NextRequest) => ReturnType<typeof intlMiddleware>)(req);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
