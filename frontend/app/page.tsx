"use client";
import axios from "axios";
import Html5QrcodePlugin from './components/qrScanner';
import { useState } from "react";

interface Item {
  id: number;
  code: string;
  name: string;
  category: string;
  status: string;
  notes: string | null;
  imageUrl: string | null;
}

const onNewScanResult = async (decodedText: string) => {
  try {
    setLoading(true);
    setError(null);

    const res = await axios.post("http://localhost:4000/scan", {
      code
    });

    setItem(res.data.item);
  } catch (err) {
    setItem(null);
    setError("Item no encontrado");
  } finally {
    setLoading(false);
  }
};


export default function Home() {

  const [item, setItem] = useState<Item | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);


  return (
    <main>
      <h1>Welcome to the Stock Sonido App</h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Scan Item</button>
      <Html5QrcodePlugin
        qrCodeSuccessCallback={onNewScanResult} />
    </main>
  );
}
