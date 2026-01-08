"use client";
import { Html5QrcodeResult, Html5QrcodeScanner, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { useEffect } from 'react';

const qrcodeRegionId = "reader";

interface Html5QrcodeConfig {
    fps?: number;
    qrbox?: number | { width: number, height: number };
    aspectRatio?: number;
    disableFlip?: boolean;
}

interface Html5QrcodePluginProps extends Html5QrcodeConfig {
    verbose?: boolean;
    qrCodeSuccessCallback: (decodedText: string, result: Html5QrcodeResult) => void;
    qrCodeErrorCallback?: (error: string) => void;
}

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props: Html5QrcodePluginProps) => {
    const config = {} as Html5QrcodeCameraScanConfig;
    if (props.fps) {
        config.fps = props.fps;
    }
    if (props.qrbox) {
        config.qrbox = props.qrbox;
    }
    if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
    }
    if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
    }
    return config;
};

const Html5QrcodePlugin = (props: Html5QrcodePluginProps) => {

    useEffect(() => {
        // when component mounts
        const config = createConfig(props);
        const verbose = props.verbose === true;
        // Suceess callback is required.
        if (!(props.qrCodeSuccessCallback)) {
            throw "qrCodeSuccessCallback is required callback.";
        }
        const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
        html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);
        // cleanup function when component will unmount
        return () => {
            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, [props]);

    return (
  <div className="scanner-container">
    <div id={qrcodeRegionId} />

    <div className="qr-overlay">
      <div className="qr-box" />
    </div>
  </div>
    );
};

export default Html5QrcodePlugin;