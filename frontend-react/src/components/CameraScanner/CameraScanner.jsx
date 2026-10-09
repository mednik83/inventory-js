import { useEffect, useRef, useState } from "react";
import "./CameraScanner.css";

function CameraScanner() {
  const scanRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let stream = null;
    let cancelled = false;

    async function start() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (cancelled) {
          s.getTracks().forEach((t) => t.stop);
          return;
        }

        stream = s;
        scanRef.current.srcObject = s;
      } catch (error) {
        setError(error.name);
      }
    }

    start();

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div>
      <video ref={scanRef} autoPlay playsInline muted />
      {error && <p>{error}</p>}
    </div>
  );
}

export default CameraScanner;
