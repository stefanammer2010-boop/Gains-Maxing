import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function BarcodeScanner({
  onProductFound,
  close,
}) {
  const scannerRef = useRef(null);

  const [error, setError] = useState("");
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    let mounted = true;

    const scanner = new Html5Qrcode(
      "barcode-reader"
    );

    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        setError("");
        setStarting(true);

        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia
        ) {
          throw new Error(
            "Camera API unavailable"
          );
        }

        await scanner.start(
          {
            facingMode: {
              ideal: "environment",
            },
          },
          {
            fps: 10,

            qrbox: {
              width: 300,
              height: 180,
            },

            aspectRatio: 1.777778,
          },
          async (decodedText) => {
            try {
              if (scanner.isScanning) {
                await scanner.stop();
              }
            } catch {
              // Scanner may already be stopped.
            }

            onProductFound(decodedText);
          },
          () => {
            // Ignore frames where no barcode is found.
          }
        );

        if (mounted) {
          setStarting(false);
        }
      } catch (err) {
        console.error(
          "Barcode scanner error:",
          err
        );

        if (!mounted) return;

        setStarting(false);

        if (
          err?.name === "NotAllowedError" ||
          String(err).includes(
            "Permission"
          )
        ) {
          setError(
            "Kamerazugriff wurde blockiert. Erlaube Safari den Zugriff auf deine Kamera."
          );
        } else {
          setError(
            "Die Kamera konnte nicht gestartet werden. Öffne die App direkt in Safari und versuche es erneut."
          );
        }
      }
    };

    startScanner();

    return () => {
      mounted = false;

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

        {starting && !error && (
          <p className="barcode-status">
            Kamera wird gestartet...
          </p>
        )}

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
          Halte den Barcode ruhig und vollständig
          in den Rahmen. Gute Beleuchtung hilft
          bei der Erkennung.
        </p>
      </div>
    </div>
  );
}