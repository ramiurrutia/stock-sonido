"use client";

import BackButton from "@/app/components/navbar/backButton";
import NavBar from "@/app/components/navbar/navBar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Stats {
    totalItems: number;
    guardados: number;
    enviados: number
    enUso: number;
    baja: number;
    totalAnvils: number;
}

const emptyStats: Stats = {
    totalItems: 0,
    guardados: 0,
    enviados: 0,
    enUso: 0,
    baja: 0,
    totalAnvils: 0,
};

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState<Stats>(emptyStats);
    const [loading, setLoading] = useState(true);

    const isAdmin =
        status === "authenticated" &&
        session?.user?.permissions?.includes("admin.access");

    useEffect(() => {
        if (!isAdmin || !session?.user?.accessToken) {
            setLoading(false);
            return;
        }

        const fetchStats = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`, {
                    headers: {
                        Authorization: `Bearer ${session.user.accessToken}`,
                    },
                    cache: "no-store",
                });
                if (!res.ok) return;
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [isAdmin, session]);

    if (status === "loading" || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-zinc-500 bg-black">
                <div role="status">
                    <svg
                        className="mx-auto size-8 animate-spin text-zinc-100"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
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
            <div className="flex flex-col justify-center items-center min-h-screen bg-black text-zinc-200">
                <h1 className="text-xl font-bold text-red-500">Acceso Denegado</h1>
                <p className="text-zinc-500">
                    Tu usuario no tiene el permiso{" "}
                    <span className="text-red-400">admin.access</span>
                </p>
                <BackButton />
            </div>
        );
    }

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
                        <div style={{ width: `${stats.totalItems ? (stats.guardados / stats.totalItems) * 100 : 0}%` }} className="bg-emerald-500" />
                        <div style={{ width: `${stats.totalItems ? (stats.enUso / stats.totalItems) * 100 : 0}%` }} className="bg-yellow-200" />
                        <div style={{ width: `${stats.totalItems ? (stats.enviados / stats.totalItems) * 100 : 0}%` }} className="bg-blue-500" />
                        <div style={{ width: `${stats.totalItems ? (stats.baja / stats.totalItems) * 100 : 0}%` }} className="bg-red-500" />
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
