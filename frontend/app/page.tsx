"use client"

import { useRouter } from "next/navigation";
import Header from "./components/navbar/navBar";
import { LastItem } from "./components/lastItem";
import AdminShortcuts from "./components/ui/AdminShorcuts";
import { HiOutlineQrCode, HiOutlineArchiveBox, HiOutlineQueueList } from "react-icons/hi2";

export default function Home() {
  const router = useRouter();

  return (
    <main className="w-full text-zinc-200 flex flex-col overflow-x-hidden">
      <Header />

      <div className="flex flex-col p-5 max-w-xl mx-auto w-full mt-20">

        <div className="flex flex-col mt-4 mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Audio
          </h1>
          <p className="text-zinc-500 text-sm font-medium">
            Bahía Blanca • Inventario
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <button
            onClick={() => router.push('/scan')}
            className="col-span-2 flex items-center justify-between p-5 rounded-xl 
                       bg-zinc-100 text-zinc-900 active:scale-[0.98] transition-transform"
          >
            <div className="flex flex-col items-start">
              <span className="text-xl font-semibold">Escanear</span>
              <span className="text-xs font-semibold opacity-40">Cámara QR</span>
            </div>
            <HiOutlineQrCode className="text-3xl" />
          </button>

          <button
            onClick={() => router.push('/item')}
            className="flex flex-col items-start p-5 bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-800 rounded-xl active:scale-[0.98]"
          >
            <HiOutlineQueueList className="text-2xl mb-2 text-zinc-400" />
            <span className="font-semibold">Items</span>
          </button>

          <button
            onClick={() => router.push('/anvil')}
            className="flex flex-col items-start p-5 bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-800 rounded-xl active:scale-[0.98]"
          >
            <HiOutlineArchiveBox className="text-2xl mb-2 text-zinc-400" />
            <span className="font-semibold">Anviles</span>
          </button>
        </div>

        <div className="space-y-6">
          <LastItem />
          <AdminShortcuts />
        </div>
      </div>
    </main>
  );
}
