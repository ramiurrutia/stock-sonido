"use client"

import { signOut, useSession } from "next-auth/react";
import { HiOutlineLogout } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();
  const { status } = useSession();

  if (status !== "authenticated") {
    return <span className="text-sm text-zinc-500 underline underline-offset-2" onClick={()=> router.push("/")}>Seguir sin iniciar sesión</span>
  }

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium 
                 text-zinc-400 hover:text-red-400 bg-zinc-900/50 
                 hover:bg-red-400/10 border border-zinc-800 
                 hover:border-red-400/30 rounded-lg transition-all 
                 duration-200 group active:scale-[0.98] active:border-red-400/50 active:text-red-400"
    >
      <HiOutlineLogout className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
      <span>Cerrar sesión</span>
    </button>
  );
}
