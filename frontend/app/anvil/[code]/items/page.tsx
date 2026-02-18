"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { BsTrash } from "react-icons/bs";
import BackButton from "@/app/components/navbar/backButton";
import NavBar from "@/app/components/navbar/navBar";
import Loading from "@/app/loading";

interface AnvilData {
  anvil: {
    id: number;
    code: string;
    name: string;
    status: string;
    image_url: string | null;
    notes: string | null;
    created_at: string;
  };
  items: Array<{
    id: number;
    code: string;
    name: string;
    category: string;
    status: string;
    image_url: string | null;
    notes: string | null;
    content_notes: string | null;
    moved_at: string;
    added_at: string;
  }>;
}

const getStatusDotClass = (status: string) => {
  switch (status) {
    case "Guardado":
      return "bg-emerald-400 ring-emerald-400/20 ring-3";
    case "En uso":
      return "bg-amber-300 ring-amber-300/20 ring-3";
    case "Enviado":
      return "bg-sky-400 ring-sky-400/20 ring-3";
    case "Baja":
      return "bg-red-500 ring-red-500/20 ring-3";
    default:
      return "bg-zinc-500 ring-zinc-500/20 ring-3";
  }
};

export default function AnvilItemsPage() {
  const params = useParams();
  const code = params.code as string;
  const router = useRouter();
  const { data: session, status } = useSession();
  const canRemoveItem = session?.user?.permissions?.includes("anvil.remove_item") || false;

  const [data, setData] = useState<AnvilData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnvil = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/anvils/${code}`);
        setData(data);
      } catch (error) {
        console.error("Error fetching anvil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnvil();
  }, [code]);

  const removeItemFromAnvil = async (itemId: number, itemName: string) => {
    if (!data) return;
    if (status !== "authenticated" || !session?.user?.accessToken) return;

    const result = await Swal.fire({
      text: `Eliminar ${itemName} del anvil?`,
      showConfirmButton: true,
      showCancelButton: true,
      theme: "dark",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/anvils/${data.anvil.id}/items/${itemId}`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });

      const { data: updatedData } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/anvils/${code}`);
      setData(updatedData);
      Swal.fire({
        title: `${itemName} eliminado del anvil`,
        toast: true,
        theme: "dark",
        position: "top",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Error removing item:", error);
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.error : "Error al eliminar item";
      Swal.fire({
        title: errorMessage || "Error al eliminar item",
        toast: true,
        theme: "dark",
        icon: "error",
        position: "top",
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  if (loading) return <Loading />;

  if (!data) {
    return (
      <main className="flex flex-col items-center justify-center h-screen w-screen p-4">
        <p className="text-red-400">No se encontraron los datos</p>
      </main>
    );
  }

  return (
    <div className="flex flex-col p-4 items-center justify-center">
      <BackButton />
      <NavBar />
      <div className="rounded-lg p-4 bg-linear-to-tl from-zinc-900 to-zinc-800 ring ring-zinc-600 transition-all min-w-3xs mt-22">
        <div className="text-center border-b border-zinc-600 pb-2 mb-3">
          <h2 className="font-bold text-lg text-zinc-200">{data.anvil.name}</h2>
          <p className="font-medium text-sm text-zinc-400 tracking-wider">{data.anvil.code}</p>
          <p className="text-zinc-500 text-xs mt-1">Items dentro: {data.items.length}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {data.items.length === 0 && <p className="text-zinc-500 text-center">Este anvil no tiene items.</p>}
          {data.items.map((item) => (
            <div key={item.id} className="border border-zinc-700 rounded-lg p-2 flex justify-between items-start">
              <div>
                <h3
                  className="flex flex-row items-center underline underline-offset-2 cursor-pointer text-sm w-32 truncate"
                  onClick={() => {
                    router.push(`/item/${item.code}`);
                  }}
                >
                  {item.name}
                </h3>
                <div className="flex flex-row items-center justify-between">
                  <p className="text-zinc-400 text-sm font-mono">{item.code}</p>
                  <span className={`size-2 rounded-full ${getStatusDotClass(item.status)}`} />
                </div>
              </div>
              {canRemoveItem && (
                <button
                  onClick={() => removeItemFromAnvil(item.id, item.name)}
                  className="text-zinc-200 hover:text-zinc-500 rounded transition-colors ml-8"
                >
                  <BsTrash className="size-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div >
  );
}
