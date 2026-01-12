"use client";

import QrScanner from "./components/qrScanner";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content";

export default function Home() {
  const router = useRouter();

  const onNewScanResult = (decodedText: string) => {
    Swal.fire({
      text: `Buscando ${decodedText}`,
      theme: "dark",
      showConfirmButton: false,
      toast: true,
      animation: false
    })
    router.push(`/item/${decodedText}`);
  };

  return (
    <main>
      <h1>Welcome to the Stock Sonido App</h1>

      <button
        onClick={() => {
          withReactContent(Swal).fire({
            title: 'Scan',
            html: <QrScanner
              onScan={(decodedText) => {
                onNewScanResult(decodedText);
                setTimeout(() => {
                  Swal.close();
                }, 1000)
              }}
            />,
            showConfirmButton: false,
            showCancelButton: false,
            theme: "dark",
          })
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Scan Item
      </button>


    </main>
  );
}
