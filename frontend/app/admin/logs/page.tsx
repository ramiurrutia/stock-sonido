"use client";

import BackButton from "@/app/components/navbar/backButton";
import NavBar from "@/app/components/navbar/navBar";
import StatusBadge from "@/app/components/ui/StatusBadge";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Movement {
  id: number;
  item_id: number;
  item_name?: string;
  item_code?: string;
  anvil_id: number | null;
  action: "status_change" | "assign_anvil" | "remove_anvil" | "manual_update";
  previous_status: string | null;
  new_status: string;
  user_name: string;
  notes: string | null;
  created_at: string;
}

export default function LogsPage() {
  const { data: session, status } = useSession();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = status === "authenticated" && session?.user?.permissions?.includes("admin.access");

  useEffect(() => {
    if (!isAdmin || !session?.user?.accessToken) {
      setLoading(false);
      return;
    }

    const fetchMovements = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logs`, {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          cache: "no-store",
        });

        if (!res.ok) {
          setMovements([]);
          return;
        }

        const data = await res.json();
        setMovements(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
        setMovements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, [isAdmin, session]);

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-zinc-500">
        <div role="status">
          <svg className="mx-auto size-8 animate-spin text-zinc-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-zinc-200">
        <h1 className="text-xl font-bold text-red-500">Acceso Denegado</h1>
        <p className="text-zinc-500">
          Tu usuario no tiene el permiso <span className="text-red-400">admin.access</span>
        </p>
        <BackButton />
      </div>
    );
  }

  return (
    <main className="min-h-screen text-zinc-200 p-4 pb-20 flex flex-col items-center">
      <NavBar />

      <div className="w-full max-w-2xl mt-16">
        <div className="flex items-center gap-4 mb-8 justify-center">
          <BackButton />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight">Logs de movimientos</h1>
            <p className="text-xs text-zinc-500 uppercase font-semibold">Ultimos 20 registros</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {movements.length === 0 ? (
            <p className="text-center text-zinc-500 border border-zinc-800 rounded-xl p-6 bg-zinc-900/30">
              No hay movimientos registrados.
            </p>
          ) : (
            movements.map((log) => (
              <div key={log.id} className="flex flex-col bg-zinc-900/30 border border-zinc-800 p-4 rounded-xl">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Accion</p>
                    <span className="text-zinc-300 font-mono text-xs uppercase">{log.action.replace("_", " ")}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Usuario</p>
                    <p className="text-sm text-zinc-200">{log.user_name || "No registrado"}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 text-center">Item afectado</p>
                  <div className="flex flex-col justify-between items-center">
                    <h2 className="text-base font-semibold text-zinc-100">{log.item_name}</h2>
                    <span className="text-zinc-500 font-mono text-xs -m-1">{log.item_code}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center bg-zinc-950/40 rounded-lg p-3 border border-zinc-800">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-zinc-500 mb-1 uppercase">Previo</span>
                    <StatusBadge status={log.previous_status || "none"} />
                  </div>

                  <div className="flex justify-center text-zinc-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-zinc-500 mb-1 uppercase">Nuevo</span>
                    <StatusBadge status={log.new_status} />
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {new Date(log.created_at).toLocaleDateString()} -
                    {" "}
                    {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="text-[11px] text-zinc-500 truncate font-mono">ItemID: {log.item_id} | LogID: {log.id}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
