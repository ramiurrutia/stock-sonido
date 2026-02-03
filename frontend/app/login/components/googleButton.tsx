"use client";

import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";


export default function GoogleLoginButton() {
  const { data: session, status } = useSession();
  const userName = session?.user?.name ?? session?.user?.email ?? "Usuario";

  return (
    status === "authenticated" ? (
      <div
        className="flex items-center justify-center gap-3 w-full max-w-sm mx-auto 
                   bg-zinc-900 text-zinc-400 font-medium py-2 px-4 rounded-lg 
                   ring-1 ring-zinc-700 shadow-sm opacity-50 cursor-not-allowed"
      >
        <FcGoogle className="w-6 h-6 opacity-50" />
        <span>{userName}</span>
      </div>
    ) : (
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="flex items-center justify-center gap-3 w-full max-w-sm mx-auto 
                   bg-white text-zinc-900 font-medium py-2 px-4 rounded-lg 
                   hover:bg-zinc-100 transition-all duration-200 
                   ring-1 ring-zinc-300 shadow-sm active:scale-[0.98]"
      >
        <FcGoogle className="w-6 h-6" />
        <span>Acceder con Google</span>
      </button>
    )
  );
}
