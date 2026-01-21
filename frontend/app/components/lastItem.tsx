"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, startTransition } from "react";
import { Skeleton } from "@/app/components/ui/Skeleton";
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
    return (
      <div className="flex flex-col items-center justify-center mt-12">
        <Skeleton className="h-5 w-34 mb-2" />
        <div className="bg-zinc-800 px-4 py-2 rounded-lg w-68">
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-12">
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