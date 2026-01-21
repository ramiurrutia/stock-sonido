"use client"
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-center p-4 h-screen w-screen text-white">

      <div className="flex flex-col items-center bg-linear-to-tl from-zinc-900 to-zinc-800 ring-1 ring-zinc-600 p-10 rounded-lg shadow-2xl max-w-sm w-full text-center z-10">
        <h1 className="text-6xl font-black text-zinc-700 mb-2">404</h1>
        
        <div className="w-12 h-1 bg-red-500 mb-6 rounded-full"></div>
        
        <h2 className="text-xl font-bold text-zinc-200 mb-2">
          Página no encontrada
        </h2>
        
        <p className="text-zinc-500 text-sm mb-6">
          Lo sentimos, el recurso que estás buscando no existe o ha sido movido.
        </p>

        <button
          onClick={()=>{router.back()}}
          className="w-full py-3 bg-zinc-200 hover:bg-zinc-400 text-zinc-900 rounded-md text-sm transition-all shadow-lg active:scale-95"
        >
          Volver
        </button>
      </div>

      <div className="fixed bottom-10 text-zinc-900/5 text-[15rem] font-black">
        NULL
      </div>
    </main>
  );
}