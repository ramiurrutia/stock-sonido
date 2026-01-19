import axios from "axios";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { Combobox } from '@headlessui/react'
import StatusBadge from "@/app/components/ui/StatusBadge";

interface Item {
    id: string;
    code: string;
    name: string;
    status: string;
}

export default function SearchBar() {
    const router = useRouter();
    const [search, setSearch] = useState<string>("")
    const [items, setItems] = useState<Item[]>([])


    const [debounceSearch] = useDebounce(search, 600)

    useEffect(() => {
        if (!debounceSearch) return;
        if (debounceSearch.length < 2) return;

        const searchItems = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:4000/items/search?q=${debounceSearch}`
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
                }
            }}
        >
            <div className="relative ">
                <Combobox.Input
                    className="rounded-lg border-none bg-linear-to-r from-zinc-900 to-zinc-800 ring-1 ring-zinc-700/60 py-2 data-focus:px-10 text-center text-sm/6 text-white focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-none transition-all"
                    placeholder="Buscar item"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                    autoComplete="off"
                />

                {items.length > 0 && (
                    <Combobox.Options className="absolute z-10 mt-1 w-full rounded-lg shadow">
                        {items.map((item) => (
                            <Combobox.Option
                                key={item.id}
                                value={item}
                                className=
                                "cursor-pointer px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-all"
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-sm text-zinc-400">{item.code}</span>

                                </div>
                                <StatusBadge status={item.status} />
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                )}
            </div>
        </Combobox >
    );
}
