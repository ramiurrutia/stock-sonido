"use client";

import QrScanner from './components/qrScanner';
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  const onNewScanResult = async (decodedText: string) => {
    try {
      router.push(`/item/${decodedText}`);
    } catch (err) {
      console.error("Error sending scan result:", err);
    } finally {
    }
  };

  return (
    <main>
      <h1>Welcome to the Stock Sonido App</h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Scan Item</button>
      <QrScanner
        qrCodeSuccessCallback={onNewScanResult} />
    </main>
  );
}
