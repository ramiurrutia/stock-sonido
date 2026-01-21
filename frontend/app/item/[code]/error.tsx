"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

    return (
        <main className="flex flex-col items-center justify-center h-screen w-screen p-4">
            <div className="bg-linear-to-tl from-red-300/5 to-red-500/5 rounded-lg py-4 px-12 max-w-md text-center ring-1 ring-red-300/15">
                <h1 className="text-2xl font-semibold text-zinc-200 mb-4">
                    Item no encontrado
                </h1>
                <p className="text-red-400 mb-6 bg-zinc-100/5 p-2 rounded-lg font-mono">
                    {error.message || "Error no definido"}
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => router.push("/scan")}
                        className="px-4 py-2 bg-linear-to-br from-red-200/10 to-red-300/10 hover:bg-red-200/15 text-white rounded transition-colors"
                    >
                        Escanear otro
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="px-4 py-2 text-zinc-300 hover:text-zinc-400 rounded transition-colors underline underline-offset-2"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        </main>
    );
}