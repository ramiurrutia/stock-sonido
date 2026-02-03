"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

export default function PermissionsRefresher() {
  const { data: session, status, update } = useSession();
  const hasRefreshed = useRef(false);

  useEffect(() => {
    const refreshPermissions = async () => {
      // Solo ejecutar una vez
      if (hasRefreshed.current) return;

      // Esperar a que la sesión cargue
      if (status === "loading") {
        console.log("⏳ Cargando sesión...");
        return;
      }

      if (status === "unauthenticated") {
        console.log("❌ No hay sesión activa");
        return;
      }

      if (status === "authenticated" && session?.user?.accessToken) {
        console.log("🔄 Refrescando permisos...");
        hasRefreshed.current = true; // ✅ Marcar como refrescado
        const result = await update();
        console.log("✅ Permisos actualizados:", result);
      }
    };

    refreshPermissions();
  }, [status, session, update]);

  return null;
}