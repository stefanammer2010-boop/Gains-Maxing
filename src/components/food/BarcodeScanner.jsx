import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function BarcodeScanner({
  onProductFound,
  close,
}) {
  const scannerRef = useRef(null);
  const stoppedRef = useRef(false);

  const [error, setError] = useState("");
  const [status, setStatus] = useState(
    "Kamera wird gestartet..."
  );

  useEffect(() => {
    let mounted = true;

    const startScanner = async () => {
      try {
        setError("");
        setStatus("Kamera wird gestartet...");

        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia
        ) {
          throw new Error("CAMERA_NOT_SUPPORTED");
        }

        const cameras =
          await Html5Qrcode.getCameras();

        if (!mounted) return;

        if (!cameras || cameras.length === 0) {
          throw new Error("NO_CAMERA");
        }

        // Auf iPhones sind die Labels nach erteilter
        // Berechtigung normalerweise verfügbar.
        const backCamera =
          cameras.find((camera) => {
            const label =
              camera.label.toLowerCase();

            return (
              label.includes("back") ||
              label.includes("rear") ||
              label.includes("environment") ||
              label.includes("rück")
            );
          }) ||
          cameras[cameras.length - 1];

        const scanner = new Html5Qrcode(
          "barcode-reader",
          false
        );

        scannerRef.current = scanner;
        stoppedRef.current = false;

        await scanner.start(
          backCamera.id,
          {
            fps: 10,

            qrbox: {
              width: 260,
              height: 150,
            },

            aspectRatio: 1.777778,

            disableFlip: false,
          },

          async (decodedText) => {
            if (stoppedRef.current) return;

            stoppedRef.current = true;

            try {
              if (scanner.isScanning) {
                await scanner.stop();
              }
            } catch (stopError) {
              console.log(
                "Scanner already stopped:",
                stopError
              );
            }

            if (mounted) {
              setStatus("Produkt erkannt.");
              onProductFound(decodedText);
            }
          },

          () => {
            // Kein Barcode in diesem Frame.
            // Bewusst ignorieren.
          }
        );

        if (mounted) {
          setStatus(
            "Barcode in den Rahmen halten."
          );
        }
      } catch (err) {
        console.error(
          "Barcode scanner error:",
          err
        );

        if (!mounted) return;

        const message =
          String(
            err?.message ||
              err ||
              ""
          ).toLowerCase();

        if (
          err?.name === "NotAllowedError" ||
          message.includes("permission") ||
          message.includes("notallowed")
        ) {
          setError(
            "Kamerazugriff wurde blockiert. Erlaube Safari den Kamerazugriff und lade die Seite neu."
          );
        } else if (
          message.includes("no_camera")
        ) {
          setError(
            "Auf diesem Gerät wurde keine Kamera gefunden."
          );
        } else if (
          message.includes(
            "camera_not_supported"
          )
        ) {
          setError(
            "Der Browser unterstützt keinen Kamerazugriff."
          );
        } else {
          setError(
            `Scanner konnte nicht gestartet werden: ${
              err?.message || String(err)
            }`
          );
        }

        setStatus("");
      }
    };

    // Kleiner Delay, damit das DOM-Element
    // #barcode-reader sicher gerendert ist.
    const timer = setTimeout(
      startScanner,
      150
    );

    return () => {
      mounted = false;
      clearTimeout(timer);

      const scanner =
        scannerRef.current;

      if (scanner?.isScanning) {
        scanner
          .stop()
          .catch(() => {});
      }
    };
  }, [onProductFound]);

  const handleClose = async () => {
    const scanner =
      scannerRef.current;

    try {
      if (scanner?.isScanning) {
        await scanner.stop();
      }
    } catch (err) {
      console.log(
        "Scanner stop error:",
        err
      );
    }

    close();
  };

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
            onClick={handleClose}
          >
            ×
          </button>
        </div>

        {status && !error && (
          <p className="barcode-status">
            {status}
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
          in den Rahmen.
        </p>
      </div>
    </div>
  );
}