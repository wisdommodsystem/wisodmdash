import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import connectToDatabase from "./mongodb";
import UserProfile from "@/models/UserProfile";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // تفعيل وضع التصحيح لرؤية الأخطاء في سجلات Render
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
      authorization: { params: { scope: "identify" } }
    })
  ],
  pages: {
    signIn: "/",
    error: "/" // توجيه أخطاء تسجيل الدخول للصفحة الرئيسية
  },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile && "id" in profile) {
        token.discordId = String(profile.id);
        
        // إعادة تفعيل الـ Webhook بعد استقرار الاستضافة على Vercel
        try {
          const headersList = await headers();
          const ip = headersList.get("x-forwarded-for") || "unknown";
          const userAgent = headersList.get("user-agent") || "unknown";
          await sendLoginLog(profile, ip, userAgent);
        } catch (webhookErr) {
          console.error("Webhook logging failed:", webhookErr);
        }
        
        // محاولة تحديث البيانات في قاعدة البيانات
        try {
          await connectToDatabase();
          const p = profile as any;
          const avatarUrl = p.image_url || (p.avatar 
            ? `https://cdn.discordapp.com/avatars/${p.id}/${p.avatar}.png` 
            : `https://cdn.discordapp.com/embed/avatars/${parseInt(p.id.slice(-1)) % 5}.png`);
            
          await UserProfile.findOneAndUpdate(
            { discordId: String(p.id) },
            { 
              username: p.global_name || p.username,
              avatar: avatarUrl,
              lastSeen: new Date()
            },
            { upsert: true }
          );
        } catch (err) {
          console.error("Database update error during JWT callback:", err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session && session.user && token.discordId) {
        (session.user as any).discordId = String(token.discordId);
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("[Auth Redirect] url:", url, "baseUrl:", baseUrl);
      // توجيه المستخدم دائماً إلى لوحة تحكم ديسكورد بعد النجاح
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return `${baseUrl}/discord`;
    }
  }
};
