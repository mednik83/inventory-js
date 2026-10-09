import { useRef, useState } from "react";
import API from "../../api/client";
import { useNavigate } from "react-router-dom";
import "./ScanPage.css";
import CameraScanner from "../../components/CameraScanner/CameraScanner";

function isUuid(text) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    text,
  );
}

function ScanPage() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const inputRef = useRef(null);

  async function handleScannedCode(text) {
    setError("");
    try {
      const uuid = text.trim();

      if (!isUuid(uuid)) {
        setError("Unknown code format");
        return;
      }

      await API.getEquipmentByUuid(uuid);

      navigate(`/equipments/${uuid}`);
    } catch (error) {
      if (error?.status === 404) {
        setError("Equipment not found");
      } else {
        setError(error.message);
      }
    } finally {
      inputRef.current?.focus();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText) return;

    handleScannedCode(trimmedText);

    setText("");
  }
  return (
    <div>
      <h1>Scan page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="scan">scan</label>
        <input
          onChange={(e) => setText(e.target.value)}
          id="scan"
          placeholder="scan"
          value={text}
          autoFocus={true}
          ref={inputRef}
        />
      </form>
      <CameraScanner onScan={handleScannedCode} />
      <div>
        <span>{error}</span>
      </div>
    </div>
  );
}

export default ScanPage;
