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

  if (!mounted) {
    return (
      <div role="status" className="mt-10 w-full flex justify-center py-8">
        <svg className="size-6 animate-spin text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="w-full mt-6">
      <div className="flex items-center gap-2 mb-3 px-1 w-full">
        <span className="text-xs uppercase tracking-[0.15em] text-zinc-500">
          Visto recientemente
        </span>
        <div className="h-px flex-1 bg-zinc-800/50" />
      </div>

      <button
        className="w-full flex items-center justify-between p-4 bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-800 rounded-xl transition-all group active:scale-[0.98]"
        onClick={() => router.push(`/item/${item.code}`)}
      >
        <div className="flex flex-col items-start">
          <span className="font-medium text-zinc-200 group-hover:text-white transition-colors">
            {item.name}
          </span>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            {item.code}
          </span>
        </div>
        
        <div className="p-2 rounded-lg bg-zinc-950/30 text-zinc-600 group-hover:text-zinc-200 border border-zinc-800 group-hover:border-zinc-600 transition-all">
          <BsLink45Deg className="text-xl" />
        </div>
      </button>
    </div>
  );
}
