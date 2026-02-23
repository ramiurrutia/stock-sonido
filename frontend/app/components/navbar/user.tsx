"use client";

import { useRouter } from "next/navigation";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { useSession } from "next-auth/react";

export default function User() {
  const router = useRouter();
  const { status } = useSession();

  return (
    <button
      onClick={() => router.push("/login")}
      className="fixed mr-4 right-0 rounded-full bg-zinc-900/50 border border-zinc-800 
                 hover:border-zinc-700 hover:bg-zinc-800 transition-all active:scale-95 group"
    >
      <HiOutlineUserCircle 
        className="size-8 text-zinc-500 group-hover:text-zinc-200 transition-colors" 
      />
      
      {status === "authenticated" && (
        <span className="absolute top-0 right-0 size-3 bg-emerald-500 rounded-full border-2 border-black" />
      )}
    </button>
  );
}