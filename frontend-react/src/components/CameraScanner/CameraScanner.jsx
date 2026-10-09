import { useEffect, useRef, useState } from "react";
import "./CameraScanner.css";

function CameraScanner({ onScan }) {
  const videoRef = useRef(null);
  const [error, setError] = useState("");
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    let stream = null;
    let cancelled = false;
    let timerId = null;

    async function start() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }

        stream = s;
        videoRef.current.srcObject = s;
      } catch (error) {
        if (cancelled) {
          return;
        } else if (error.name === "NotAllowedError") {
          setError("Camera access denied");
        } else {
          setError(error.message);
        }
      }

      if (!("BarcodeDetector" in window)) {
        return;
      }

      const detector = new BarcodeDetector({
        formats: ["qr_code"],
      });

      async function tick() {
        if (cancelled) return;
        const video = videoRef.current;

        if (video && video.readyState >= 2) {
          try {
            const codes = await detector.detect(video);
            if (codes.length > 0) {
              onScanRef.current(codes[0].rawValue);
              return;
            }
          } catch {
            /* empty */
          }
        }
        timerId = setTimeout(tick, 250);
      }
      tick();
    }

    start();

    return () => {
      cancelled = true;
      clearTimeout(timerId);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted />
      {error && <p>{error}</p>}
    </div>
  );
}

export default CameraScanner;
