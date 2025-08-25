// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const pathname = req.nextUrl.pathname;
    const role = token?.role as string | undefined;

    // If no token, allow access to home page (auth modal will handle login)
    if (!token) {
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/studentportal")) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
    }

    // Check role-based access
    if (pathname.startsWith("/dashboard") && role !== "admin") {
        // Don't redirect if user is already where they should be
        if (role === "student" && !pathname.startsWith("/studentportal")) {
            return NextResponse.redirect(new URL("/studentportal", req.url));
        }
        return NextResponse.next();
    }

    if (pathname.startsWith("/studentportal") && role !== "student") {
        // Don't redirect if user is already where they should be
        if (role === "admin" && !pathname.startsWith("/dashboard")) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/studentportal/:path*"],
};