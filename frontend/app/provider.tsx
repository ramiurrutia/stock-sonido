"use client";

import { SessionProvider } from "next-auth/react";
import PermissionsRefresher from "./components/PermissionRefresher";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PermissionsRefresher />
      {children}
    </SessionProvider>
  );
}
