"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

const MIN_REFRESH_GAP_MS = 10 * 60 * 1000;
const PERIODIC_REFRESH_MS = 60 * 60 * 1000;

export default function PermissionsRefresher() {
  const { status, update } = useSession();
  const lastRefreshRef = useRef(0);
  const refreshInFlightRef = useRef(false);

  useEffect(() => {
    const refreshSession = async (reason: string) => {
      if (status !== "authenticated") return;
      if (refreshInFlightRef.current) return;

      const now = Date.now();
      if (now - lastRefreshRef.current < MIN_REFRESH_GAP_MS) return;

      refreshInFlightRef.current = true;
      try {
        console.log(`Refrescando sesion (${reason})...`);
        await update();
        lastRefreshRef.current = Date.now();
      } catch (error) {
        console.error("Error refrescando sesion:", error);
      } finally {
        refreshInFlightRef.current = false;
      }
    };

    if (status === "loading") return;
    if (status === "unauthenticated") return;

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void refreshSession("visible");
      }
    };

    const onFocus = () => {
      void refreshSession("focus");
    };

    const onOnline = () => {
      void refreshSession("online");
    };

    void refreshSession("init");

    window.addEventListener("focus", onFocus);
    window.addEventListener("online", onOnline);
    document.addEventListener("visibilitychange", onVisibility);

    const intervalId = window.setInterval(() => {
      void refreshSession("interval");
    }, PERIODIC_REFRESH_MS);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("online", onOnline);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(intervalId);
    };
  }, [status, update]);

  return null;
}
