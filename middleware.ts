// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const pathname = req.nextUrl.pathname;

    // Only check for protected routes
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/studentportal")) {
        // If no token, redirect to home page
        if (!token) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Check roles for authenticated users
        const role = token.role as string | undefined;

        // Admin can only access dashboard
        if (pathname.startsWith("/dashboard") && role !== "admin") {
            // For students trying to access dashboard, redirect to studentportal
            if (role === "student") {
                return NextResponse.redirect(new URL("/studentportal", req.url));
            }
            // For users with no role or other roles, redirect to home
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Student can only access studentportal
        if (pathname.startsWith("/studentportal") && role !== "student") {
            // For admins trying to access studentportal, redirect to dashboard
            if (role === "admin") {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
            // For users with no role or other roles, redirect to home
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/studentportal/:path*"],
};