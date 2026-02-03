"use client";

import Loading from "@/app/loading";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import StatusBadge from "../../components/ui/StatusBadge";
import ItemsActions from "./components/itemsActions";
import BackButton from "@/app/components/navbar/backButton";
import NavBar from "@/app/components/navbar/navBar";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

interface ItemData {
    id: number;
    code: string;
    name: string;
    category: string;
    status: string;
    image_url: string | null;
    notes: string | null;
    created_at: string;
    anvil: {
        id: number;
        code: string;
        name: string;
    } | null;
}

export default function ItemPage() {
    const params = useParams();
    const router = useRouter();
    const code = params.code as string;
    const [data, setData] = useState<ItemData | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingNotes, setEditingNotes] = useState(false);
    const [notes, setNotes] = useState("");
    const { data: session } = useSession();
    const permissions = session?.user?.permissions || [];
    const canChangeStatus = permissions.includes("item.change_status");
    const canEditItem = permissions.includes("item.edit");

    const fetchItem = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/items/${code}`);
            setData(response.data);
            setNotes(response.data.notes || "");

            if (typeof window !== "undefined") {
                localStorage.setItem("lastItem", JSON.stringify(response.data));
            }
        } catch (error) {
            console.error("Error fetching item:", error);
        } finally {
            setLoading(false);
        }
    }, [code]);

    useEffect(() => {
        fetchItem();
    }, [fetchItem]);

    const saveNotes = async () => {
        if (!data) return;

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${data.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ notes }),
            });
            await fetchItem();
            setEditingNotes(false);
            Swal.fire({
                title: "Notas actualizadas",
                toast: true,
                theme: "dark",
                position: "top",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Error updating notes:", error);
            Swal.fire({
                title: "Error al actualizar notas",
                toast: true,
                theme: "dark",
                icon: "error",
                position: "top"
            });
        }
    };

    const removeFromAnvil = async () => {
        if (!data || !data.anvil) return;

        const result = await Swal.fire({
            title: `¿Quitar ${data.name} del anvil ${data.anvil.name}?`,
            showConfirmButton: true,
            showCancelButton: true,
            theme: 'dark'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(
                    `${process.env.NEXT_PUBLIC_API_URL}/anvils/${data.anvil.id}/items/${data.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${session?.user?.accessToken}`,
                        },
                    }
                );
                await fetchItem();
                Swal.fire({
                    title: "Item quitado del anvil",
                    toast: true,
                    theme: "dark",
                    position: "top",
                    timer: 2000,
                    showConfirmButton: false,

                });
            } catch (error) {
                console.error("Error removing from anvil:", error);
                Swal.fire({
                    title: "Error al quitar del anvil",
                    toast: true,
                    theme: "dark",
                    icon: "error",
                    position: "top"
                });
            }
        }
    };

    if (loading) return <Loading />;
    if (!data) return (<main className="flex flex-col items-center justify-center p-4 h-screen w-screen bg-black">
        <BackButton />
        <div className="bg-linear-to-tl from-zinc-900 to-zinc-800 ring-1 ring-zinc-600 p-8 rounded-lg text-center max-w-xs">
            <h2 className="text-zinc-200 font-bold text-lg mb-2">Algo salió mal</h2>
            <p className="text-zinc-500 text-sm mb-6">No se encontraron los datos</p>
            <button
                onClick={() => window.location.reload()}
                className="bg-zinc-200 hover:bg-zinc-400 text-zinc-900 px-4 py-2 rounded transition-colors w-full"
            >
                Reintentar
            </button>
        </div>
    </main>)

    return (
        <main className="flex flex-col items-center justify-center p-4 h-screen w-screen">
            <BackButton />
            <NavBar />
            <div className="">
                <div className="flex flex-col rounded-lg p-4 bg-linear-to-tl from-zinc-900 to-zinc-800 ring ring-zinc-600 mb-4">
                    {data.image_url ? (
                        <div className="flex w-full h-full justify-center items-center">
                            <Image src={`${process.env.NEXT_PUBLIC_API_URL}${data.image_url}`} alt={data.name} className="rounded-lg" width={250} height={250} />

                        </div>
                    ) : (
                        <p className="text-center">Imagen no encontrada</p>
                    )}
                    <div className="text-center border-b border-zinc-600 p-2 mb-1">
                        <h2 className="font-bold text-lg text-zinc-200">{data.name}</h2>
                        <p className="font-medium text-sm text-zinc-400 tracking-wider">{data.code}</p>
                    </div>
                    <div className="flex flex-row justify-between items-center mt-2">
                        <h3 className="text-sm text-zinc-400">Categoria</h3>
                        <p className="text-zinc-200">{data.category}</p>
                    </div>
                    <div className="flex flex-row justify-between items-center mt-2">
                        <h3 className="text-sm text-zinc-400">Estado</h3>
                        <p>
                            <StatusBadge status={data.status} />
                        </p>
                    </div>

                    {data.anvil && (
                        <div className="mt-3 p-3 border border-zinc-600 rounded-lg bg-zinc-900">
                            <h3 className="text-xs text-zinc-400">Anvil asignado</h3>
                            <p className="font-semibold text-sm text-zinc-200">{data.anvil.name} <span className="text-sm text-zinc-400">| {data.anvil.code}</span></p>

                            <div className="flex gap-2 mt-2 items-center">
                                <button
                                    onClick={() => router.push(`/anvil/${data.anvil!.code}`)}
                                    className="px-2 py-1 bg-zinc-200 hover:bg-zinc-400 text-zinc-900 rounded transition-colors text-xs"
                                >
                                    Ver Anvil
                                </button>
                                <button
                                    onClick={removeFromAnvil}
                                    className="px-2 py-1 text-zinc-200 rounded transition-colors text-xs underline underline-offset-2"
                                >
                                    Quitar
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="text-sm text-zinc-400">Notas</h3>
                            {canEditItem && !editingNotes && (
                                <button
                                    onClick={() => setEditingNotes(true)}
                                    className="text-xs text-zinc-200 hover:text-zinc-400 transition-colors underline underline-offset-2"
                                >
                                    Editar
                                </button>
                            )}
                        </div>

                        {editingNotes ? (
                            <div>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="Agregar notas..."
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={saveNotes}
                                        className="px-3 py-1 bg-zinc-200 hover:bg-zinc-400 text-zinc-900 rounded transition-colors text-xs"
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingNotes(false);
                                            setNotes(data.notes || "");
                                        }}
                                        className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors text-xs"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-zinc-200 text-sm p-2 rounded-lg bg-zinc-950/30">{data.notes || "Sin notas"}</p>
                        )}
                    </div>
                </div>
                {canChangeStatus &&
                    <ItemsActions
                        code={data.code}
                        currentStatus={data.status}
                        onStatusChange={fetchItem}
                    />
                }

            </div>
        </main>
    );
}