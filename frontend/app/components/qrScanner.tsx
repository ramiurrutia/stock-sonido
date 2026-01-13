"use client";
import { Html5Qrcode } from 'html5-qrcode';
import { useEffect } from 'react';

// Creates the configuration object for Html5QrcodeScanner.
export default function QrScanner({ onScan }: { onScan: (text: string) => void }) {
  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
      { facingMode: "environment" }, // cámara trasera
      {
        fps: 40,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.777778
      },
      (decodedText) => {
        onScan(decodedText);
        html5QrCode.stop();
      },
      () => { }
    );

    return () => {
      html5QrCode.stop().catch(() => { });
    };
  }, [onScan]);

  return <div id="reader" className="w-full max-w-md" />;
}