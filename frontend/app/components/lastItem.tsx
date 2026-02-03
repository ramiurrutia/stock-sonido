"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, startTransition } from "react";
import { BsLink45Deg } from "react-icons/bs";

type Item = {
  id: number;
  code: string;
  name: string;
  status: string;
};

export function LastItem() {

  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("lastItem");
    startTransition(() => {
      if (stored) {
        setItem(JSON.parse(stored) as Item);
      }
      setMounted(true);
    });
  }, []);

  if (!item) return null;

  if (!mounted) {
    return (<div role="status" className="mt-24">
      <svg className="mx-auto size-8 animate-spin text-zinc-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>);
  }

  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <p className="text-zinc-400 mb-2">Último item visto</p>
      <div
        className="bg-linear-to-tl from-zinc-800 to-zinc-900 ring-1 ring-zinc-700 px-4 py-3 rounded-lg w-76 cursor-pointer hover:ring-zinc-600 transition-all"
        onClick={() => router.push(`/item/${item.code}`)}
      >
        <p className="flex flex-row items-center underline underline-offset-2">{item.name}<BsLink45Deg className="size-6" /></p>
        <p className="text-xs text-zinc-400">{item.code}</p>
      </div>
    </div>
  );
}