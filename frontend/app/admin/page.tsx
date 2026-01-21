"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BackButton from "@/app/components/navbar/backButton";
import { BsTerminal, BsGraphUp } from "react-icons/bs";

export default function AdminPage() {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    // Agregamos un estado de "cargando" para evitar parpadeos
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // Envolvemos la lógica en una función
        const checkAuth = () => {
            const userName = localStorage.getItem("userName");
            const admins = ["Ramiro Urrutia", "Jonatan Bittner", "Matias Kroneberger"];

            if (userName && admins.includes(userName)) {
                // SOLUCIÓN: Usamos setTimeout para salir del ciclo síncrono
                setTimeout(() => {
                    setAuthorized(true);
                    setChecking(false);
                }, 0);
            } else {
                router.push('/');
            }
        };

        checkAuth();
    }, [router]);

    // Mientras verifica, no mostramos nada (o un spinner si quisieras)
    if (checking) return null;

    // Si terminó de chequear y no está autorizado, el router.push ya actuó, 
    // pero por seguridad retornamos null aquí también.
    if (!authorized) return null;

    return (
        <main className="flex flex-col items-center justify-center min-h-screen text-zinc-200 p-4">
            <BackButton />
            
            <h1 className="text-2xl mb-12 tracking-tight">Panel Administrativo</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                <Link href="/admin/logs" className="group">
                    <div className="flex flex-col items-center p-8 bg-linear-to-tl from-zinc-900 to-zinc-800 ring-1 ring-zinc-700 rounded-xl hover:ring-blue-500 transition-all">
                        <BsTerminal className="text-4xl mb-4 text-zinc-500 group-hover:text-blue-400" />
                        <span>Ver Logs</span>
                        <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">Movimientos</p>
                    </div>
                </Link>

                <Link href="/admin/dashboard" className="group">
                    <div className="flex flex-col items-center p-8 bg-linear-to-tl from-zinc-900 to-zinc-800 ring-1 ring-zinc-700 rounded-xl hover:ring-emerald-500 transition-all">
                        <BsGraphUp className="text-4xl mb-4 text-zinc-500 group-hover:text-emerald-400" />
                        <span>Dashboard</span>
                        <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">Estadísticas</p>
                    </div>
                </Link>
            </div>
        </main>
    );
}