import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

function QrScanner({ onScanSuccess, onClose }) {
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    const qrCode = new Html5Qrcode("qr-reader");
    html5QrCodeRef.current = qrCode;

    qrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScanSuccess(decodedText);
        },
        () => {
          // fires continuously while no QR code is found — safe to ignore
        },
      )
      .catch((err) => {
        console.error("Camera start failed:", err);
      });

    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current
          .stop()
          .then(() => html5QrCodeRef.current.clear())
          .catch(() => {});
      }
    };
  }, []);

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
      <div
        id="qr-reader"
        ref={scannerRef}
        className="rounded-xl overflow-hidden"
      />
      <button
        onClick={onClose}
        className="w-full mt-4 bg-surface-light hover:bg-white/10 text-text px-4 py-2 rounded-xl transition"
      >
        Close Scanner
      </button>
    </div>
  );
}

export default QrScanner;
