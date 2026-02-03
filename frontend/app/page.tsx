"use client"

import Button from "./components/button"
import { LastItem } from "./components/lastItem";
import Header from "./components/navbar/navBar";
import { useRouter } from "next/navigation";
import AdminShortcuts from "./components/ui/AdminShorcuts";

export default function Home() {
  const router = useRouter()

  return (

    <main className="flex flex-col items-center justify-center p-6 h-screen w-screen">
      <Header />

      <div className="flex flex-col items-center mb-12">
        <h1 className="text-center text-5xl font-semibold text-heading text-transparent bg-clip-text bg-linear-to-b to-zinc-400 from-zinc-200 leading-10">Audio</h1>
        <span className="text-lg text-zinc-200">Bahía Blanca</span>
      </div>
      <div className="flex flex-row gap-4">
        <Button
          textButton="Escanear"
          onClick={() => { router.push(`/scan`) }}
        />
        <Button
          textButton="Anviles"
          onClick={() => { router.push(`/anvil`) }} />
      </div>
      <LastItem />
      <AdminShortcuts />
    </main>
  );
}

