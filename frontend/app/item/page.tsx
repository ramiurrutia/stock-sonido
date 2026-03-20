import BackButton from "../components/navbar/backButton";
import Link from "next/link";
import { HiOutlineChevronRight } from "react-icons/hi2";
import CreateItemButton from "./components/CreateItemButton";

interface Item {
  id: number;
  code: string;
  name: string;
  category: string;
  status: string;
  image_url: string | null;
  notes: string | null;
  created_at: string;
}

const getStatusDotClass = (status: string) => {
  switch (status) {
    case "Guardado": return "bg-emerald-400 ring-emerald-400/20";
    case "En uso": return "bg-amber-300 ring-amber-300/20";
    case "Enviado": return "bg-sky-400 ring-sky-400/20";
    case "Baja": return "bg-red-500 ring-red-500/20";
    default: return "bg-zinc-500 ring-zinc-500/20";
  }
};

async function getItems() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Error al cargar items");
  return res.json();
}

export default async function ItemsPage() {
  const items: Item[] = await getItems();

  // 1. Agrupar items por categoría
  const groupedItems = items.reduce((acc, item) => {
    const cat = item.category || "Sin categoría";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, Item[]>);

  // 2. Definir el orden manual de las categorías (opcional)
  const categoryOrder = ["Tripode", "Microfono", "Potencia", "Parlante", "Consola", "Cable", "Accesorio"];
  const sortedCategories = Object.keys(groupedItems).sort((a, b) =>
    categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  return (
    <main className="text-zinc-200 flex flex-col p-4 pb-20">
      <div className="w-full max-w-4xl mx-auto my-10">

        <div className="flex items-center justify-between mb-10 px-1">
          <div className="flex items-center gap-3">
            <BackButton />
            <h1 className="text-2xl font-bold text-white tracking-tight">Inventario</h1>
            <span className="text-xs font-black bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-md text-zinc-500 uppercase">
              Total: {items.length}
            </span>
          </div>
          <CreateItemButton />
        </div>

        {sortedCategories.map((category) => (
          <section key={category} className="mb-10">
            <div className="flex items-center gap-3 mb-5 px-1">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">
                {category}
              </span>
              <div className="h-px flex-1 bg-zinc-800/50" />
              <span className="text-[10px] font-mono text-zinc-700">
                {groupedItems[category].length}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {groupedItems[category].map((item) => (
                <Link
                  href={`/item/${item.code}`}
                  key={item.id}
                  className="group relative flex flex-col justify-between bg-zinc-900/40 hover:bg-zinc-800/60 border border-zinc-800 rounded-xl p-4 min-h-22 transition-all active:scale-[0.97]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                      {item.code}
                    </span>
                    <span className={`size-2 rounded-full ring-2 ${getStatusDotClass(item.status)}`} />
                  </div>

                  <div className="mt-2">
                    <h2 className="text-sm text-zinc-200 group-hover:text-white line-clamp-2 leading-tight pr-4">
                      {item.name}
                    </h2>
                  </div>
                  <HiOutlineChevronRight
                    className="absolute bottom-4 right-3 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all text-sm"
                  />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
