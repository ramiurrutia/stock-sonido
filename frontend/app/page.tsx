"use client";
import axios from "axios";
import Html5QrcodePlugin from './components/qrScanner';
import { useState } from "react";
import Image from "next/image";

interface Item {
  id: number;
  code: string;
  name: string;
  category: string;
  status: string;
  notes: string | null;
  imageUrl: string | null;
}

function OnScan(params: string) {
  const [item, setItem] = useState<Item | null>(null);

  return (<>
    {item ? (
      <div>
        <h2>Item Details</h2>
        <p><strong>Name:</strong> {item.name}</p>
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Status:</strong> {item.status}</p>
        <p><strong>Notes:</strong> {item.notes}</p>
        {item.imageUrl && <Image src={item.imageUrl} alt={item.name} />}
      </div>) : (<p>Loading item data...</p>
    )}
  </>);
}

const onNewScanResult = async (decodedText: string) => {
  try {
    const res = await axios.post("http://localhost:4000/scan", {
      code: decodedText
    });
    
  } catch (err) {
    console.error("Error sending scan result:", err);
  } finally {
  }
};


export default function Home() {
  return (
    <main>
      <h1>Welcome to the Stock Sonido App</h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Scan Item</button>
      <Html5QrcodePlugin
        qrCodeSuccessCallback={onNewScanResult} />
    </main>
  );
}
