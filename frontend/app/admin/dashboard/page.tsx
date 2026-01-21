import BackButton from "@/app/components/navbar/backButton";
import NavBar from "@/app/components/navbar/navBar";

interface Stats {
    totalItems: number;
    guardados: number;
    enviados: number
    enUso: number;
    baja: number;
    totalAnvils: number;
}

async function getStats(): Promise<Stats> {
    const res = await fetch("http://localhost:4000/stats", { cache: 'no-store' });
    if (!res.ok) return { totalItems: 0, guardados: 0, enviados: 0, enUso: 0, baja: 0, totalAnvils: 0 };
    return res.json();
}

export default async function DashboardPage() {
    const stats = await getStats();

    const metrics = [
        { label: "Items Totales", value: stats.totalItems, color: "text-zinc-200" },
        { label: "Guardados", value: stats.guardados, color: "text-emerald-400" },
        { label: "En Uso", value: stats.enUso, color: "text-yellow-200" },
        { label: "Enviados", value: stats.enviados, color: "text-blue-400" },
        { label: "Baja", value: stats.baja, color: "text-red-400" },
        { label: "Anviles", value: stats.totalAnvils, color: "text-zinc-400" },
    ];

    return (
        <div className="flex flex-col justify-center min-h-screen text-zinc-200 p-4 items-center">
            <BackButton />
            <NavBar />

            <div className="w-full max-w-2xl">
                <h1 className="text-2xl font-bold mb-8 text-center">Estado del Inventario</h1>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {metrics.map((m, i) => (
                        <div key={i} className="bg-linear-to-tl from-zinc-900 to-zinc-800 ring-1 ring-zinc-700 p-6 rounded-lg text-center">
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">{m.label}</p>
                            <p className={`text-4xl font-black ${m.color}`}>{m.value}</p>
                        </div>
                    ))}
                </div>

                {/* Aquí podrías luego agregar un gráfico de barras simple con CSS puro */}
                <div className="mt-8 bg-zinc-900/50 p-6 rounded-lg ring-1 ring-zinc-800">
                    <h3 className="text-sm font-bold mb-4 text-zinc-400">Distribución de Estados</h3>
                    <div className="flex h-4 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div style={{ width: `${(stats.guardados / stats.totalItems) * 100}%` }} className="bg-emerald-500" />
                        <div style={{ width: `${(stats.enUso / stats.totalItems) * 100}%` }} className="bg-yellow-200" />
                        <div style={{ width: `${(stats.enviados / stats.totalItems) * 100}%` }} className="bg-blue-500" />
                        <div style={{ width: `${(stats.baja / stats.totalItems) * 100}%` }} className="bg-red-500" />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-zinc-500 italic">
                        <span>Guardados</span>
                        <span>En uso</span>
                        <span>Enviados</span>
                        <span>Baja</span>
                    </div>
                </div>
            </div>
        </div>
    );
}