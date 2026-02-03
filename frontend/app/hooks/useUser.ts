"use client";

import { useSession } from "next-auth/react";

type SessionUser = {
  name?: string | null;
  email?: string | null;
  username?: string | null;
  accessToken?: string;
  permissions?: string[];
  dbId?: number;
};

export function useUser() {
  const { data: session, status } = useSession();
  const user = session?.user as SessionUser | undefined;

  const name = user?.name ?? user?.username ?? null;
  const email = user?.email ?? null;
  const permissions = user?.permissions ?? [];
  const accessToken = user?.accessToken ?? null;
  const dbId = user?.dbId ?? null;

  return {
    status,
    session,
    user,
    name,
    email,
    permissions,
    accessToken,
    dbId,
    isAuthenticated: status === "authenticated",
  };
}