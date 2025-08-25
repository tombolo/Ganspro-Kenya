import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

// Define a custom user type that includes the role property
interface CustomUser extends User {
    id: string;
    email: string;
    name?: string | null;
    role: string;
}

// Define a custom JWT type that includes the role property
interface CustomJWT extends JWT {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
}

// Define a custom session user type that includes the role property
interface CustomSessionUser {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
}

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const client = await clientPromise;
                const db = client.db();

                const user = await db
                    .collection("users")
                    .findOne({ email: credentials.email });

                if (!user) return null;

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );
                if (!isValid) return null;

                // ✅ Make sure role is returned (default = "student")
                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role || "student",
                };
            },
        }),
    ],
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const customUser = user as CustomUser;
                token.id = customUser.id;
                token.email = customUser.email;
                token.name = customUser.name || undefined;
                token.role = customUser.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                const customToken = token as CustomJWT;
                const customSessionUser = session.user as CustomSessionUser;
                customSessionUser.id = customToken.id;
                customSessionUser.email = customToken.email as string;
                customSessionUser.name = customToken.name as string;
                customSessionUser.role = customToken.role;
            }
            return session;
        },
    },
};

// Export the handler directly
export default NextAuth(authOptions);