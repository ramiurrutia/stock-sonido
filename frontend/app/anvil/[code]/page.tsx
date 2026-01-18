"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import StatusBadge from "@/app/components/ui/StatusBadge";
import { Combobox } from "@headlessui/react";
import { useDebounce } from "use-debounce";

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

  // Para el buscador de items
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [debouncedSearch] = useDebounce(search, 600);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchAnvil = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4000/anvils/${code}`);
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
      const { data } = await axios.get(`http://localhost:4000/anvils/${code}`);
      setData(data);
    } catch (error) {
      console.error("Error fetching anvil:", error);
    }
  };

  // Buscar items
  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) {
      setSearchResults([]);
      return;
    }

    const searchItems = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/items/search?q=${debouncedSearch}`
        );
        // Filtrar anvils de los resultados
        const filtered = data.filter((item: SearchItem) => !item.code.startsWith('ANVI-'));
        setSearchResults(filtered);
      } catch (error) {
        console.error("Error searching items:", error);
      }
    };

    searchItems();
  }, [debouncedSearch]);

  // Agregar item al anvil
  const addItemToAnvil = async (item: SearchItem) => {
    if (!data) return;

    setIsAdding(true);
    try {
      await axios.post("http://localhost:4000/anvils/add", {
        anvil_id: data.anvil.id,
        item_id: item.id,
        notes: null
      });

      // Limpiar búsqueda y refrescar
      setSearch("");
      setSearchResults([]);
      await fetchAnvil();

      alert(`${item.name} agregado al anvil`);
    } catch (error) {
      console.error("Error adding item:", error);
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.error : "Error al agregar item";
      alert(errorMessage || "Error al agregar item");
    } finally {
      setIsAdding(false);
    }
  };

  // Eliminar item del anvil
  const removeItemFromAnvil = async (itemId: number, itemName: string) => {
    if (!data) return;
    if (!confirm(`¿Eliminar ${itemName} del anvil?`)) return;

    try {
      await axios.delete(`http://localhost:4000/anvils/${data.anvil.id}/items/${itemId}`);
      await fetchAnvil();
      alert(`${itemName} eliminado del anvil`);
    } catch (error) {
      console.error("Error removing item:", error);
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.error : "Error al eliminar item";
      alert(errorMessage || "Error al eliminar item");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!data) return <p>Anvil no encontrado</p>;

  return (
    <div className="flex flex-col p-4 items-center justify-center w-screen h-screen">
      <div className="rounded-lg p-4 bg-linear-to-tl from-zinc-900 to-zinc-800 ring ring-zinc-600 transition-all">
      <div className="flex flex-col  mb-4">
        <div className="text-center border-b border-zinc-400/80 p-2 mb-1">
          <h2 className="font-bold text-lg text-zinc-200">{data.anvil.name}</h2>
          <p className="font-medium text-sm text-zinc-400 tracking-wider">{data.anvil.code}</p>
        </div>
        <h3 className="text-sm text-zinc-400 mt-2">Estado</h3>
        <p><StatusBadge status={data.anvil.status} /></p>

        {data.anvil.notes && (
          <div>
            <h3 className="text-sm text-zinc-400 mt-2">Notas</h3>
            <p className="text-zinc-200">{data.anvil.notes}</p>
          </div>
        )}
      </div>


      {/* Buscador para agregar items */}
      <div className="my-6">
        <h3 className="text-sm mb-2 text-center">Agregar item al anvil</h3>
        <Combobox
          onChange={(item: SearchItem | null) => {
            if (item) addItemToAnvil(item);
          }}
          disabled={isAdding}
        >
          <div className="relative">
            <Combobox.Input
              className="rounded-lg bg-zinc-900 focus:bg-zinc-800 ring-zinc-700 ring-1 focus:ring-zinc-500 w-full py-2 text-center text-sm/6 text-zinc-200 focus:not-data-focus:outline-none data-focus:outline-none transition-all"
              placeholder="Buscar item para agregar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isAdding}
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
                        <p className="text-zinc-200">{item.name}</p>
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

      {/* Lista de items en el anvil */}
      <h2 className="text-xl font-bold mt-8 mb-4">Items en este Anvil ({data.items.length})</h2>

      <div className="space-y-4">
        {data.items.map((item) => (
          <div key={item.id} className="border border-zinc-700 rounded-lg p-4 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-zinc-400">Código: {item.code}</p>
              <p className="text-zinc-400">Categoría: {item.category}</p>
              <div className="mt-2">
                <StatusBadge status={item.status} />
              </div>
            </div>
            <button
              onClick={() => removeItemFromAnvil(item.id, item.name)}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}