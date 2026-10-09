import { useEffect, useRef, useState } from "react";
import "./CameraScanner.css";

function CameraScanner() {
  const videoRef = useRef(null);
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
          s.getTracks().forEach((t) => t.stop());
          return;
        }

        stream = s;
        videoRef.current.srcObject = s;
      } catch (error) {
        if (cancelled) {
          setError(error.name);
        } else {
          setError(error.message);
        }
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
      <video ref={videoRef} autoPlay playsInline muted />
      {error && <p>{error}</p>}
    </div>
  );
}

export default CameraScanner;
