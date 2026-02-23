"use client";

import BackButton from "@/app/components/navbar/backButton";
import NavBar from "@/app/components/navbar/navBar";
import Loading from "@/app/loading";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
    HiOutlineCube,
    HiOutlineArchiveBox,
    HiOutlineTruck,
    HiOutlinePlay,
    HiOutlineInboxStack,
    HiOutlineArrowDownTray
} from "react-icons/hi2";

interface Stats {
    totalItems: number;
    guardados: number;
    enviados: number;
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

    const isAdmin =
        status === "authenticated" &&
        session?.user?.permissions?.includes("admin.access");

    useEffect(() => {
        if (!isAdmin || !session?.user?.accessToken) {
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
            }
        };

        fetchStats();
    }, [isAdmin, session]);

    if (status === "loading") return <Loading />;

    if (!isAdmin) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen text-zinc-200 p-6 text-center">
                <h1 className="text-xl font-bold text-red-500 mb-2">Acceso Denegado</h1>
                <p className="text-zinc-500 mb-6 text-sm">No tienes permisos para acceder al panel de administración.</p>
                <BackButton />
            </div>
        );
    }

    const safeTotal = stats.totalItems || 1;
    const distribution = [
        { label: "Guardados", value: stats.guardados, color: "bg-emerald-300", text: "text-emerald-300" },
        { label: "En uso", value: stats.enUso, color: "bg-amber-300", text: "text-amber-300" },
        { label: "Enviados", value: stats.enviados, color: "bg-sky-400", text: "text-sky-400" },
        { label: "Baja", value: stats.baja, color: "bg-red-400", text: "text-red-400" },
    ];

    const metrics = [
        {
            label: "Items Totales",
            value: stats.totalItems,
            icon: <HiOutlineCube />,
            accent: "from-zinc-100/20 to-zinc-100/0 border-zinc-700",
            text: "text-white",
            span: "col-span-2",
        },
        {
            label: "Guardados",
            value: stats.guardados,
            icon: <HiOutlineArchiveBox />,
            accent: "from-emerald-500/20 to-emerald-500/0 border-emerald-500/30",
            text: "text-emerald-300",
        },
        {
            label: "En uso",
            value: stats.enUso,
            icon: <HiOutlinePlay />,
            accent: "from-amber-400/20 to-amber-400/0 border-amber-400/30",
            text: "text-amber-300",
        },
        {
            label: "Enviados",
            value: stats.enviados,
            icon: <HiOutlineTruck />,
            accent: "from-sky-500/20 to-sky-500/0 border-sky-500/30",
            text: "text-sky-400",
        },
        {
            label: "De baja",
            value: stats.baja,
            icon: <HiOutlineArrowDownTray />,
            accent: "from-red-500/20 to-red-500/0 border-red-500/30",
            text: "text-red-400",
        },
        {
            label: "Anviles",
            value: stats.totalAnvils,
            icon: <HiOutlineInboxStack />,
            accent: "from-zinc-600/20 to-zinc-600/0 border-zinc-700",
            text: "text-zinc-300",
            span: "col-span-2",
        },
    ];

    return (
        <main className="min-h-screen text-zinc-200 p-4 pb-20 flex flex-col items-center">
            <NavBar />

            <div className="w-full max-w-2xl mt-16">
                <div className="flex items-center gap-4 mb-8 justify-center">
                    <BackButton />
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-zinc-200 tracking-tight">Dashboard</h1>
                        <p className="text-xs text-zinc-600 uppercase font-semibold">Monitoreo de inventario</p>
                    </div>
                </div>

                <section className="mb-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
                    <div className="flex items-center justify-between text-xs uppercase tracking-wider text-zinc-500 mb-3">
                        <span>Distribucion de estados</span>
                        <span>{stats.totalItems} items</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden flex">
                        {distribution.map((d) => (
                            <div
                                key={d.label}
                                className={`${d.color} h-full`}
                                style={{ width: `${(d.value / safeTotal) * 100}%` }}
                            />
                        ))}
                    </div>
                    <div className="grid grid-cols-2 mt-3 text-sm">
                        {distribution.map((d) => (
                            <div key={d.label} className="flex items-center justify-between px-2">
                                <span className="text-zinc-500">{d.label}</span>
                                <span className={`font-bold ${d.text}`}>{d.value}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-4">
                    {metrics.map((m, i) => (
                        <div
                            key={i}
                            className={`
                                p-5 rounded-xl border
                                bg-zinc-900/50 border-zinc-800
                                ${m.span || "col-span-1"}
                            `}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                                        {m.label}
                                    </p>
                                    <p className={`text-3xl font-bold tracking-tight ${m.text}`}>
                                        {m.value}
                                    </p>
                                </div>
                                <div className={`text-xl ${m.text}`}>{m.icon}</div>
                            </div>
                            <div className="text-sm uppercase text-zinc-500 text-right">
                                {stats.totalItems > 0 && m.label !== "Items Totales" && m.label !== "Anviles"
                                    ? `${Math.round((m.value / safeTotal) * 100)}%`
                                    : ""}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
