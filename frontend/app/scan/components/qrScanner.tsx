"use client";
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function QrScanner() {
  const [error, setError] = useState<Error | null>(null);
  const hasScannedRef = useRef(false);
  const router = useRouter();
  if (error) {
    throw error;
  }
  useEffect(() => {
    const handleScan = (decodedText: string) => {
      if (decodedText.startsWith("ANVI")) {
        router.push(`/anvil/${decodedText}`);
      } else {
        router.push(`/item/${decodedText}`);
      }
    };
    let scanner: Html5Qrcode | null = null;
    let mounted = true;

    const startScanner = async () => {
      const readerElement = document.getElementById("reader");
      if (!readerElement) return;

      readerElement.innerHTML = "";

      try {
        scanner = new Html5Qrcode("reader");

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 40,
            qrbox: 250,
            aspectRatio: 1.0,
            disableFlip: false
          },
          async (decodedText) => {
            if (!mounted || hasScannedRef.current) return;
            hasScannedRef.current = true;

            handleScan(decodedText);

            if (scanner) {
              try {
                await scanner.stop();
                await scanner.clear();
              } catch (error) {
                console.error("Error starting scanner:", error);
                setError(error instanceof Error ? error : new Error("Fallo al iniciar cámara"))
              }
            }
          },
          () => { }
        );
      } catch (error) {
        console.error("Error starting scanner:", error);
        setError(error instanceof Error ? error : new Error("Fallo al iniciar cámara"))
      }
    };

    const timer = setTimeout(startScanner, 0);

    return () => {
      mounted = false;
      clearTimeout(timer);

      const cleanup = async () => {
        if (scanner) {
          try {
            await scanner.stop();
            await scanner.clear();
          } catch (e) { console.log(e) }
        }

        const readerElement = document.getElementById("reader");
        if (readerElement) {
          readerElement.innerHTML = "";
        }

        scanner = null;
        hasScannedRef.current = false;
      };

      cleanup();
    };
  }, [router]);

  return <div id="reader" className="w-full max-w-md" />;
}