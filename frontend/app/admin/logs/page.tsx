import BackButton from "@/app/components/navbar/backButton";
import NavBar from "@/app/components/navbar/navBar";
import StatusBadge from "@/app/components/ui/StatusBadge";

export const dynamic = "force-dynamic";

interface Movement {
  id: number;
  item_id: number;
  item_name?: string;
  item_code?: string;
  anvil_id: number | null;
  action: 'status_change' | 'assign_anvil' | 'remove_anvil' | 'manual_update';
  previous_status: string | null;
  new_status: string;
  user_name: string;
  notes: string | null;
  created_at: string;
}

async function getMovements(): Promise<Movement[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logs`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    throw new Error("Error fetching logs:" + error);
    return [];
  }
}

export default async function LogsPage() {
  const movements = await getMovements();

  return (
    <div className="flex flex-col justify-center min-h-screen bg-black text-white">
      <BackButton />
      <NavBar />

      <div className="max-w-2xl mx-auto w-full mt-20 mb-20">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Logs de Movimientos</h1>
          <p className="text-zinc-500 text-sm">Últimos 20 registros del sistema</p>
        </header>

        <div className="flex flex-col gap-4 px-4">
          {movements.length === 0 ? (
            <p className="text-center text-red-400">No hay movimientos registrados.</p>
          ) : (
            movements.map((log) => (
              <div
                key={log.id}
                className="flex flex-col bg-linear-to-tl from-zinc-900 to-zinc-800 ring-1 ring-zinc-600 p-4 rounded-lg shadow-xl"
              >
                <div className="flex justify-between items-center border-b border-zinc-700/50 pb-3 mb-3">
                  <div className="items-center">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Acción</p>
                    <span className="text-blue-300 font-mono text-xs uppercase">
                      {log.action.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-right items-center">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Usuario</p>
                    <p className="text-sm text-zinc-200">{log.user_name || "No registrado"}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 text-center">Item afectado</p>
                  <div className="flex flex-col justify-between items-center">
                    <h2 className="text-lg font-semibold text-zinc-100">{log.item_name}</h2>
                    <span className="text-zinc-500 font-mono text-sm -m-1">{log.item_code}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center bg-black/40 rounded-md p-3 border border-zinc-800">
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

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {new Date(log.created_at).toLocaleDateString()} - {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-[11px] text-zinc-500 truncate font-mono">
                    ItemID: {log.item_id} | LogID: {log.id}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}