// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  // 1. Extendemos el modelo User (lo que devuelve el authorize o signIn)
  interface User {
    accessToken?: string;
    permissions?: string[];
    dbId?: number;
  }

  // 2. Extendemos la Sesión (lo que usas en el frontend con useSession)
  interface Session {
    user: {
      accessToken?: string;
      permissions?: string[];
      dbId?: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  // 3. Extendemos el token JWT
  interface JWT {
    accessToken?: string;
    permissions?: string[];
    dbId?: number;
  }
}