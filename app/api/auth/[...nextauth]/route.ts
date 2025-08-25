import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/auth";

const handler = NextAuth(authOptions);

// ✅ only export allowed methods
export { handler as GET, handler as POST };
