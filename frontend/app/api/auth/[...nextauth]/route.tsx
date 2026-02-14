import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

type BackendAuthPayload = {
  token: string;
  user: {
    id: number;
    permissions: string[];
  };
};

async function issueBackendToken(params: {
  email?: string | null;
  name?: string | null;
  googleId?: string | null;
}): Promise<BackendAuthPayload | null> {
  const { email, name, googleId } = params;

  if (!email || !name || !googleId) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, googleId }),
  });

  if (!res.ok) return null;
  return res.json();
}

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
      if (account?.provider !== "google") return true;

      try {
        const googleId = account.providerAccountId || (user.id as string | undefined);

        if (!googleId || !user.email || !user.name) {
          console.error("Google signIn missing fields", {
            googleId,
            email: user.email,
            name: user.name,
          });
          return false;
        }

        const data = await issueBackendToken({
          email: user.email,
          name: user.name,
          googleId,
        });

        if (!data) return false;

        user.accessToken = data.token;
        user.permissions = data.user.permissions;
        user.dbId = data.user.id;
        user.googleId = googleId;
        return true;
      } catch (error) {
        console.error("Error conectando con backend:", error);
        return false;
      }
    },

    async jwt({ token, user, trigger }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.permissions = user.permissions;
        token.dbId = user.dbId;
        token.googleId = user.googleId;
        token.email = user.email;
        token.name = user.name;
      }

      // update() desde cliente: valida token y renueva si quedo invalido
      if (trigger === "update") {
        try {
          let meRes: Response | null = null;

          if (token.accessToken) {
            meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            });
          }

          if (meRes?.ok) {
            const me = await meRes.json();
            token.permissions = me.permissions;
          } else if (!meRes || meRes.status === 401 || meRes.status === 403) {
            const renewed = await issueBackendToken({
              email: (token.email as string | undefined) ?? null,
              name: (token.name as string | undefined) ?? null,
              googleId: (token.googleId as string | undefined) ?? null,
            });

            if (renewed?.token) {
              token.accessToken = renewed.token;
              token.permissions = renewed.user.permissions || [];
              token.dbId = renewed.user.id;
            }
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
