import { useRef, useState } from "react";
import API from "../../api/client";
import { useNavigate } from "react-router-dom";

function ScanPage() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const inputRef = useRef(null);

  function validateUuid(text) {
    return text.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  }

  async function handleScannedCode(text) {
    setError("");
    try {
      const uuid = text.trim();

      if (!validateUuid(uuid)) {
        throw new Error("uuid error");
      }

      await API.getEquipmentByUuid(uuid);

      navigate(`/equipments/${uuid}`);
    } catch (error) {
      if (error?.status === 404) {
        setError("Not found");
      }
      setError(error.message);
    } finally {
      inputRef.current.focus();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText) return;

    handleScannedCode(text);

    setText("");
  }
  return (
    <div>
      <h1>Title</h1>
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
      <div>
        <span>{error}</span>
      </div>
    </div>
  );
}

export default ScanPage;
