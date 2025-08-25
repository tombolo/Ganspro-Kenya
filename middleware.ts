import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const pathname = req.nextUrl.pathname;

    // Protected routes
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/studentportal")) {
        // 🔒 If not logged in, force logout
        if (!token) {
            return NextResponse.redirect(new URL("/api/auth/signout", req.url));
        }

        // ✅ Authenticated: check roles
        const role = token.role as string | undefined;

        if (pathname.startsWith("/dashboard") && role !== "admin") {
            return NextResponse.redirect(new URL("/studentportal", req.url));
        }

        if (pathname.startsWith("/studentportal") && role !== "student") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/studentportal/:path*"],
};
