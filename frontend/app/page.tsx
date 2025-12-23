"use client";
import axios from "axios";
import QrScanner from './components/qrScanner';
import { useState } from "react";

export default function Home() {

interface Item {
  imageUrl: string;
  name: string;
  code: string;
  category: string;
  status: string;
  notes: string;
}

const [scanResult, setScanResult] = useState<Item | null>(null);

const ItemResult = ({data} : {data: Item}) => (
  <div>
    <h2>Scan Result:</h2>
    <p>Image URL: {data.imageUrl}</p>
    <p>Name: {data.name}</p>
    <p>Code: {data.code}</p>
    <p>Category: {data.category}</p>
    <p>Status: {data.status}</p>
    <p>Notes: {data.notes}</p>
  </div>
);

const onNewScanResult = async (decodedText: string) => {
  try {
    const res = await axios.post("http://localhost:4000/scan", {
      code: decodedText
    });
    setScanResult(res.data);
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
      {scanResult ? <ItemResult data={scanResult} /> : <p>No scan result yet.</p>}
    </main>
  );
}
