import { useState } from "react";

function RoomForm({ handleRoomForm }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) return;

    handleRoomForm(name);

    setName("");
  };

  return (
    <form className="roomForm" onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Room name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button>Send</button>
    </form>
  );
}

export default RoomForm;
