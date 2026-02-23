import axios from "axios";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { Combobox } from '@headlessui/react'
import { HiMagnifyingGlass } from "react-icons/hi2";

interface Item {
    id: string;
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

export default function SearchBar() {
    const router = useRouter();
    const [search, setSearch] = useState<string>("")
    const [items, setItems] = useState<Item[]>([])

    const [debounceSearch] = useDebounce(search, 400)

    useEffect(() => {
        if (!debounceSearch) return;
        if (debounceSearch.length < 2) return;

        const searchItems = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/items/search?q=${debounceSearch}`
                );
                setItems(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.log(error)
            }


        }

        searchItems()
    }, [debounceSearch])

    return (
        <Combobox
            onChange={(item: Item | null) => {
                if (item) {
                    const route = item.code.startsWith('ANVI-')
                        ? `/anvil/${item.code}`
                        : `/item/${item.code}`;
                    router.push(route);
                    setSearch("");
                }
            }}
        >
            <div className="relative w-full max-w-55">
                <div className="relative">
                    <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 size-4 pointer-events-none" />
                    <Combobox.Input
                        className="w-full rounded-xl bg-zinc-900 ring-1 ring-zinc-800 py-2 pl-9 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:ring-zinc-700/50 focus:bg-zinc-900/50 outline-none transition-all"
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoComplete="off"
                    />
                </div>

                {items.length > 0 && (
                    <Combobox.Options className="absolute z-50 mt-2 max-h-60 w-55 overflow-auto rounded-xl bg-zinc-900 border border-zinc-800 p-1 shadow-2xl backdrop-blur-xl right-0 md:left-0">
                        {items.map((item) => (
                            <Combobox.Option
                                key={item.id}
                                value={item}
                                className="
                                    flex flex-col gap-1 cursor-pointer rounded-lg px-3 py-2 transition-colors active:bg-zinc-700/50 hover:bg-zinc-700/50"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-medium text-zinc-200 truncate leading-none">
                                        {item.name}
                                    </span>
                                    <span className={`size-1.5 shrink-0 rounded-full ${getStatusDotClass(item.status)}`} />
                                </div>
                                <span className="font-mono text-xs text-zinc-500 tracking-wider">
                                    {item.code}
                                </span>
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                )}
            </div>
        </Combobox >
    );
}
