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
                const client = await clientPromise;
                const db = client.db();

                const user = await db
                    .collection("users")
                    .findOne({ email: credentials?.email });

                if (!user) return null;

                const isValid = await bcrypt.compare(
                    credentials!.password,
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
        async jwt({ token, user }: { token: JWT; user?: User }) {
            if (user) {
                token.id = (user as CustomUser).id;
                token.email = (user as CustomUser).email ?? undefined;
                token.name = (user as CustomUser).name ?? undefined;
                token.role = (user as CustomUser).role;
            }
            // Ensure token.email is never null
            if (token.email === null) {
                token.email = undefined;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                (session.user as CustomSessionUser).id = (token as CustomJWT).id;
                (session.user as CustomSessionUser).email = (token as CustomJWT).email as string;
                (session.user as CustomSessionUser).name = (token as CustomJWT).name as string;
                (session.user as CustomSessionUser).role = (token as CustomJWT).role;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };