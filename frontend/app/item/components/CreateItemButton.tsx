"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { HiOutlinePlus } from "react-icons/hi2";

export default function CreateItemButton() {
  const { data: session } = useSession();
  const canCreate = session?.user?.permissions?.includes("admin.access");

  if (!canCreate) return null;

  return (
    <Link
      href="/item/create"
      className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900/70 text-zinc-200 hover:bg-zinc-800 transition-colors"
      aria-label="Crear item"
      title="Crear item"
    >
      <HiOutlinePlus className="size-5" />
    </Link>
  );
}
