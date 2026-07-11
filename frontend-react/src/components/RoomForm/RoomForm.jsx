import { useEffect, useState } from "react";

function RoomForm({ handleRoomForm, editingRoom }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editingRoom) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(editingRoom.name);
    }
  }, [editingRoom]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) return;

    const formData = {
      name: name,
    };

    handleRoomForm(formData);

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
