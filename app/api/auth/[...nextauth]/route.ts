import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/auth";

// 👇 force runtime evaluation so build won't require env vars
export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
