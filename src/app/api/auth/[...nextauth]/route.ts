import NextAuth from "next-auth";
// Import cấu hình từ file chung
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };