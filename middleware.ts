// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // Custom role check - only run for authenticated users
        const token = req.nextauth.token;
        const role = token?.role as string | undefined;
        const pathname = req.nextUrl.pathname;

        // Redirect based on role for protected routes
        if (pathname.startsWith("/dashboard") && role !== "admin") {
            return NextResponse.redirect(new URL("/studentportal", req.url));
        }

        if (pathname.startsWith("/studentportal") && role !== "student") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            // Only run middleware for protected routes
            authorized: ({ req, token }) => {
                const pathname = req.nextUrl.pathname;

                // Only check auth for protected routes
                if (pathname.startsWith("/dashboard") || pathname.startsWith("/studentportal")) {
                    return !!token;
                }

                // Allow access to all other routes
                return true;
            },
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/studentportal/:path*"],
};