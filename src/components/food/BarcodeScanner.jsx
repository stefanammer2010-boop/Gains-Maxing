import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function BarcodeScanner({
  onProductFound,
  close,
}) {
  const scannerRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const scanner = new Html5Qrcode(
      "barcode-reader"
    );

    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        await scanner.start(
          {
            facingMode: "environment",
          },
          {
            fps: 10,
            qrbox: {
              width: 280,
              height: 160,
            },
          },
          async (decodedText) => {
            await scanner.stop();

            onProductFound(decodedText);
          },
          () => {}
        );
      } catch (err) {
        console.error(err);

        setError(
          "Kamera konnte nicht gestartet werden. Bitte erlaube den Kamerazugriff."
        );
      }
    };

    startScanner();

    return () => {
      if (
        scannerRef.current &&
        scannerRef.current.isScanning
      ) {
        scannerRef.current
          .stop()
          .catch(() => {});
      }
    };
  }, [onProductFound]);

  return (
    <div className="modal-backdrop">
      <div className="modal barcode-modal">
        <div className="modal-header">
          <div>
            <p className="eyebrow">
              BARCODE SCANNER
            </p>

            <h2>Scan your food</h2>
          </div>

          <button
            className="close-button"
            onClick={close}
          >
            ×
          </button>
        </div>

        <div
          id="barcode-reader"
          className="barcode-reader"
        />

        {error && (
          <p className="barcode-error">
            {error}
          </p>
        )}

        <p className="barcode-help">
          Halte den Barcode vor die Kamera.
          MAX GAINS sucht anschließend das
          Produkt.
        </p>
      </div>
    </div>
  );
}