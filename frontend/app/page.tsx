"use client"

import QrScanner from "./components/qrScanner";
import Button from "./components/button"
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
    try {router.push(`/item/${decodedText}`)}
    catch(error){console.error(error)};
  };

  return (
    <main>
      <h1>Welcome to the Stock Sonido App</h1>

      <Button
      textButton="Escanear"
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
      />
    </main>
  );
}
