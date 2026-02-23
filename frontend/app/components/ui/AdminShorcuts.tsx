"use client";

import Link from "next/link";
import { BsTerminal, BsGraphUp } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi";
import { useSession } from "next-auth/react";

export default function AdminShortcuts() {
  const { data: session, status } = useSession();
  const permissions = session?.user?.permissions || [];
  const isAdmin = status === "authenticated" && permissions.includes("admin.access");

  if (!isAdmin) return null;

  return (
    <div className="w-full mt-8">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="text-xs uppercase tracking-[0.15em] text-zinc-500">
          Admin
        </span>
        <div className="h-px flex-1 bg-zinc-800/50" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Link href="/admin/logs" className="block">
          <div className="flex items-center gap-3 p-3 bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-800 rounded-xl transition-all group">
            <BsTerminal className="text-lg text-zinc-500 group-hover:text-blue-400 group-active:text-blue-400 transition-colors" />
            <span className="text-sm text-zinc-400 group-hover:text-zinc-100">Logs</span>
          </div>
        </Link>

        <Link href="/admin/dashboard" className="block">
          <div className="flex items-center gap-3 p-3 bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-800 rounded-xl transition-all group">
            <BsGraphUp className="text-lg text-zinc-500 group-hover:text-emerald-400 group-active:text-emerald-400 transition-colors" />
            <span className="text-sm  text-zinc-400 group-hover:text-zinc-100">Dashboard</span>
          </div>
        </Link>

        <Link href="/admin/users" className="block">
          <div className="flex items-center gap-3 p-3 bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-800 rounded-xl transition-all group">
            <HiOutlineUsers className="text-lg text-zinc-500 group-hover:text-indigo-400 group-active:text-indigo-400 transition-colors" />
            <span className="text-sm text-zinc-400 group-hover:text-zinc-100">Usuarios</span>
          </div>
        </Link>

        <div className="flex items-center justify-center p-3 bg-zinc-900/10 border border-dashed border-zinc-800 rounded-xl opacity-30">
           <span className="text-sm font-bold text-zinc-600">Proximamente</span>
        </div>
      </div>
    </div>
  );
}
