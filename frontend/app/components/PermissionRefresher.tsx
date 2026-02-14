"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

export default function PermissionsRefresher() {
  const { data: session, status, update } = useSession();
  const hasRefreshed = useRef(false);

  useEffect(() => {
    const refreshPermissions = async () => {
      if (hasRefreshed.current) return;

      if (status === "loading") {
        console.log("⏳ Cargando sesión...");
        return;
      }

      if (status === "unauthenticated") {
        console.log("❌ No hay sesión activa");
        return;
      }

      if (status === "authenticated") {
        console.log("🔄 Refrescando sesión y permisos...");
        hasRefreshed.current = true;
        const result = await update();
        console.log("✅ Permisos actualizados:", result);
      }
    };

    refreshPermissions();
  }, [status, session, update]);

  return null;
}
