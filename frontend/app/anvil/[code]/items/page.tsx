"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { BsTrash } from "react-icons/bs";
import { Combobox } from "@headlessui/react";
import { useDebounce } from "use-debounce";
import BackButton from "@/app/components/navbar/backButton";
import NavBar from "@/app/components/navbar/navBar";
import Loading from "@/app/loading";
import StatusBadge from "@/app/components/ui/StatusBadge";

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

interface SearchItem {
  id: number;
  code: string;
  name: string;
  status: string;
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
  const canAddItem = session?.user?.permissions?.includes("anvil.add_item") || false;

  const [data, setData] = useState<AnvilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [debouncedSearch] = useDebounce(search, 600);
  const [isAdding, setIsAdding] = useState(false);

  const fetchAnvil = useCallback(async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/anvils/${code}`);
      setData(data);
    } catch (error) {
      console.error("Error fetching anvil:", error);
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    fetchAnvil();
  }, [fetchAnvil]);

  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) {
      setSearchResults([]);
      return;
    }

    const searchItems = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/items/search?q=${debouncedSearch}`);
        const filtered = data.filter((item: SearchItem) => !item.code.startsWith("ANVI-"));
        setSearchResults(filtered);
      } catch (error) {
        console.error("Error searching items:", error);
      }
    };

    searchItems();
  }, [debouncedSearch]);

  const addItemToAnvil = async (item: SearchItem) => {
    if (!data || !session?.user?.accessToken) return;

    setIsAdding(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/anvils/add`,
        {
          anvil_id: data.anvil.id,
          item_id: item.id,
          notes: null,
        },
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      setSearch("");
      setSearchResults([]);
      await fetchAnvil();

      Swal.fire({
        title: `${item.name} agregado al anvil`,
        theme: "dark",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Error adding item:", error);
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.error : "Error al agregar item";
      Swal.fire({ title: errorMessage || "Error al agregar item", theme: "dark", toast: true, position: "top" });
    } finally {
      setIsAdding(false);
    }
  };

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
      <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl transition-all min-w-3xs mt-22">
        <div className="text-center border-b border-zinc-700 pb-2">
          <h2 className="font-bold text-lg text-zinc-200">{data.anvil.name}</h2>
          <p className="font-medium text-sm text-zinc-400 tracking-wider">{data.anvil.code}</p>
          <p className="text-zinc-500 text-xs mt-1">Items dentro: {data.items.length}</p>
        </div>

        {canAddItem && (
          <div className="my-2">
            <h3 className="text-sm mb-1 text-center">Agregar item al anvil</h3>
            <Combobox
              onChange={(item: SearchItem | null) => {
                if (item) addItemToAnvil(item);
              }}
              disabled={isAdding}
            >
              <div className="relative">
                <Combobox.Input
                  className="rounded-lg bg-zinc-900 focus:bg-zinc-800 focus:ring-1 focus:ring-zinc-700 w-full py-2 text-center text-sm/6 text-zinc-200 focus:not-data-focus:outline-none data-focus:outline-none transition-all"
                  placeholder="Buscar item para agregar"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  disabled={isAdding}
                  autoComplete="off"
                />

                {searchResults.length > 0 && (
                  <Combobox.Options className="absolute z-10 mt-1 w-full rounded-lg shadow-lg bg-zinc-800 max-h-60 overflow-auto">
                    {searchResults.map((item) => (
                      <Combobox.Option
                        key={item.id}
                        value={item}
                        className="cursor-pointer px-2 py-2 hover:bg-zinc-700 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-zinc-200 text-sm">{item.name}</p>
                            <p className="text-sm text-zinc-400">{item.code}</p>
                          </div>
                          <StatusBadge status={item.status} />
                        </div>
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
            </Combobox>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {data.items.length === 0 && <p className="text-zinc-500 text-center">Este anvil no tiene items.</p>}
          {data.items.map((item) => (
            <div key={item.id} className="bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-800 rounded-xl active:scale-[0.98] p-2 flex justify-between items-center">
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
                  <span className={`size-1.5 rounded-full ${getStatusDotClass(item.status)}`} />
                </div>
              </div>
              {canRemoveItem && (
                <button
                  onClick={() => removeItemFromAnvil(item.id, item.name)}
                  className="text-zinc-200 hover:text-zinc-500 rounded transition-colors ml-2"
                >
                  <BsTrash className="size-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div >
  );
}
