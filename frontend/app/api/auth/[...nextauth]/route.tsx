import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const googleId =
            account.providerAccountId || (user.id as string | undefined);

          if (!googleId || !user.email || !user.name) {
            console.error("Google signIn missing fields", {
              googleId,
              email: user.email,
              name: user.name,
            });
            return false;
          }

          // Llamamos a TU endpoint
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              googleId, // ID real de Google (sub)
            }),
          });

          if (res.ok) {
            const data = await res.json();

            // Guardamos lo que devuelve tu backend
            user.accessToken = data.token;
            user.permissions = data.user.permissions; // Tu backend devuelve permisos, no roles directos
            user.dbId = data.user.id; // Guardamos el ID de tu base de datos por si acaso

            return true;
          }
          return false;
        } catch (error) {
          console.error("Error conectando con backend:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, trigger }) {
      // Login normal
      if (user) {
        token.accessToken = user.accessToken;
        token.permissions = user.permissions;
        token.dbId = user.dbId;
      }

      // 🔁 ESTO ES fetchMe
      if (trigger === "update" && token.accessToken) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            }
          );

          if (res.ok) {
            const data = await res.json();
            token.permissions = data.permissions;
          }
        } catch (e) {
          console.error("Error en fetchMe:", e);
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken as string;
      session.user.permissions = token.permissions as string[];
      session.user.dbId = token.dbId as number;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
