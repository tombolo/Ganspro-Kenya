// app/api/auth/user/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import { NextResponse } from "next/server";

// Define the type for your custom session user
interface CustomSessionUser {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Cast the user to your custom type to access the role property
        const user = session.user as CustomSessionUser;

        // Return user data including the actual role from your session
        return NextResponse.json({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role // This will be either 'admin' or 'student' based on your data
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}