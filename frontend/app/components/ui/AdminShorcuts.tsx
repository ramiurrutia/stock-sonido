"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BsTerminal, BsGraphUp } from "react-icons/bs";

export default function AdminShortcuts() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    const admins = ["Ramiro Urrutia", "Jonathan Bittner", "Matias Kroneberger"];

    if (userName && admins.includes(userName)) {
      setTimeout(() => { setIsAdmin(true) }, 0)
    }
  }, []);

  if (!isAdmin) return null;

  return (
    <>
    <h3 className="mt-4 font-mono">Admin panel</h3>
      <div className="flex gap-4 mt-2 animate-in fade-in slide-in-from-top-4 duration-500">
        <Link href="/admin/logs" className="flex-1">
          <div className="flex items-center justify-center gap-2 p-3 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-blue-500/50 rounded-lg transition-all group w-36">
            <BsTerminal className="text-zinc-500 group-hover:text-blue-400" />
            <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Logs</span>
          </div>
        </Link>
        <Link href="/admin/dashboard" className="flex-1">
          <div className="flex items-center justify-center gap-2 p-3 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/50 rounded-lg transition-all group w-36">
            <BsGraphUp className="text-zinc-500 group-hover:text-emerald-400" />
            <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Dashboard</span>
          </div>
        </Link>
      </div>
    </>
  );
}