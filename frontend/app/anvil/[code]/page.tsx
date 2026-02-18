"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import StatusBadge from "@/app/components/ui/StatusBadge";
import { Combobox } from "@headlessui/react";
import { useDebounce } from "use-debounce";
import Swal from "sweetalert2";
import BackButton from "@/app/components/navbar/backButton";
import NavBar from "@/app/components/navbar/navBar";
import Loading from "@/app/loading";
import { useSession } from "next-auth/react";

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

export default function AnvilPage() {
  const params = useParams();
  const code = params.code as string;
  const [data, setData] = useState<AnvilData | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const permissions = session?.user?.permissions || [];
  const canAddItem = permissions.includes("anvil.add_item");
  const canChangeStatus = permissions.includes("item.change_status");

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [debouncedSearch] = useDebounce(search, 600);
  const [isAdding, setIsAdding] = useState(false);

  const router = useRouter();

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

  const fetchAnvil = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/anvils/${code}`);
      setData(data);
    } catch (error) {
      console.error("Error fetching anvil:", error);
    }
  };

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

  const changeAnvilStatus = async (newStatus: string) => {
    if (!session?.user?.accessToken || !data) return;

    const result = await Swal.fire({
      title: "Confirmar cambios?",
      html: `<p>Vas a cambiar el estado del anvil de <span style="font-weight: 600;">${data.anvil.status}</span> a <span style="font-weight: 600;">${newStatus}</span></p>`,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      theme: "dark",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/anvils/${code}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      await fetchAnvil();
      Swal.fire({
        title: "Estado actualizado",
        theme: "dark",
        timer: 1700,
        timerProgressBar: true,
        toast: true,
        position: "top",
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating anvil status:", error);
      Swal.fire({
        title: "Error al cambiar estado",
        theme: "dark",
        icon: "error",
        toast: true,
      });
    }
  };

  if (loading) return <Loading />;

  if (!data) {
    return (
      <main className="flex flex-col items-center justify-center h-screen w-screen p-4">
        <div className="bg-linear-to-tl from-red-300/5 to-red-500/5 rounded-lg py-4 px-12 max-w-md text-center ring-1 ring-red-300/15">
          <h1 className="text-xl font-semibold text-zinc-200 mb-4">Ocurrio un error</h1>
          <p className="text-red-400 mb-6 bg-zinc-100/5 p-2 rounded-lg font-mono">No se encontraron los datos</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="px-4 py-2 bg-linear-to-br from-red-200/10 to-red-300/10 hover:bg-red-200/15 text-white rounded transition-colors"
            >
              Reintentar
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 text-zinc-200 hover:text-zinc-400 underline underline-offset-3 rounded transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex flex-col p-4 items-center justify-center h-screen w-screen">
      <BackButton />
      <NavBar />
      <div className="rounded-lg p-4 bg-linear-to-tl from-zinc-900 to-zinc-800 ring ring-zinc-600 transition-all min-w-3xs">
        <div className="flex flex-col mb-2">
          <div className="text-center border-b border-zinc-600 pb-2 mb-1">
            <h2 className="font-bold text-lg text-zinc-200">{data.anvil.name}</h2>
            <p className="font-medium text-sm text-zinc-400 tracking-wider">{data.anvil.code}</p>
          </div>
          <div className="flex justify-between items-center">
            <h3 className="text-sm text-zinc-400">Estado</h3>
            <p>
              <StatusBadge status={data.anvil.status} />
            </p>
          </div>

          {data.anvil.notes && (
            <div>
              <h3 className="text-sm text-zinc-400 mt-2">Notas</h3>
              <p className="text-zinc-200">{data.anvil.notes}</p>
            </div>
          )}
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

        {canChangeStatus && (
          <div className="my-3 border-t border-zinc-700 pt-3">
            <h3 className="text-sm mb-2 text-center text-zinc-400">Cambiar estado del anvil y su contenido</h3>
            <div className="grid grid-cols-2 gap-2 w-full">
              <button
                className="rounded-md border border-zinc-700 py-2 text-sm text-zinc-200 hover:bg-zinc-800 transition-colors"
                onClick={() => changeAnvilStatus("Guardado")}
              >
                Guardado
              </button>
              <button
                className="rounded-md border border-zinc-700 py-2 text-sm text-zinc-200 hover:bg-zinc-800 transition-colors"
                onClick={() => changeAnvilStatus("En uso")}
              >
                En uso
              </button>
              <button
                className="rounded-md border border-zinc-700 py-2 text-sm text-zinc-200 hover:bg-zinc-800 transition-colors"
                onClick={() => changeAnvilStatus("Enviado")}
              >
                Enviado
              </button>
              <button
                className="rounded-md border border-zinc-700 py-2 text-sm text-zinc-200 hover:bg-zinc-800 transition-colors"
                onClick={() => changeAnvilStatus("Baja")}
              >
                Baja
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4 border-t border-zinc-600 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-zinc-400 text-sm">Items dentro</h3>
            <span className="text-zinc-200 font-semibold">{data.items.length}</span>
          </div>
          <button
            onClick={() => router.push(`/anvil/${code}/items`)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900/80 py-2 text-sm text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            Ver contenido del anvil
          </button>
        </div>
      </div>
    </div>
  );
}
