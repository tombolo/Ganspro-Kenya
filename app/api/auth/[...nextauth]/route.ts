import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/auth";

// 👇 prevent Next.js from evaluating this at build time
export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
