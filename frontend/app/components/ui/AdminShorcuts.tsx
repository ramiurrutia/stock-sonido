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
    <>
    <h3 className="mt-8 font-mono">Admin panel</h3>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <Link href="/admin/logs">
          <div className="flex items-center justify-center gap-2 p-3 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-blue-500/50 rounded-lg transition-all group w-36">
            <BsTerminal className="text-zinc-500 group-hover:text-blue-400" />
            <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Logs</span>
          </div>
        </Link>
        <Link href="/admin/dashboard">
          <div className="flex items-center justify-center gap-2 p-3 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/50 rounded-lg transition-all group w-36">
            <BsGraphUp className="text-zinc-500 group-hover:text-emerald-400" />
            <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Dashboard</span>
          </div>
        </Link>
        <Link href="/admin/users">
          <div className="flex items-center justify-center gap-2 p-3 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-indigo-500/50 rounded-lg transition-all group w-36">
            <HiOutlineUsers className="text-zinc-500 group-hover:text-indigo-400" />
            <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Usuarios</span>
          </div>
        </Link>
        <div className="flex items-center justify-center gap-2 p-3 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-indigo-500/50 rounded-lg transition-all group w-36 opacity-20">
        <span className="text-sm">Próximamente</span></div>
      </div>
    </>
  );
}
