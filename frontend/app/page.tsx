"use client"

import Button from "./components/button"
import Header from "./components/navbar/navBar";
import { useRouter } from "next/navigation";

export default function Home() {


  const router = useRouter()

  return (

    <main className="flex flex-col items-center justify-center p-6 h-screen w-screen">
      <Header />

      <div className="flex flex-col items-center pb-4">
        <h1 className="text-center text-4xl font-semibold text-heading text-transparent bg-clip-text bg-linear-to-br to-zinc-300 from-zinc-200 leading-7">Audio</h1>
        <span className="text-md/tight font-light">Bahía Blanca</span>
      </div>
      <div className="flex flex-row gap-4">
        <Button
          textButton="Escanear"
          onClick={() => { router.push(`/scan`)}}
        />
        <Button
          textButton="Anviles"
          onClick={() => { router.push(`/anvil`)}} />
      </div>

    </main>
  );
}
