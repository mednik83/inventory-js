import { useEffect, useState } from "react";

function EquipmentForm({ rooms, handleEquipmentForm, editingEquipment }) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    if (editingEquipment) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(editingEquipment.name);
      setStatus(editingEquipment.status);
      setRoomId(editingEquipment.room_id);
    }
  }, [editingEquipment]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !roomId || !status) return;

    const formData = {
      name: name,
      status: status,
      room_id: roomId,
    };

    handleEquipmentForm(formData);

    setName("");
    setStatus("active");
    setRoomId("");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        onChange={(e) => setName(e.target.value)}
        type="text"
        value={name}
        placeholder="name"
        name="name"
      />
      <select
        name="status"
        onChange={(e) => setStatus(e.target.value)}
        value={status}
      >
        <option value={"active"}>active</option>
        <option value={"inactive"}>inactive</option>
        <option value={"written_off"}>written off</option>
      </select>
      <select
        name="room_id"
        onChange={(e) => setRoomId(e.target.value)}
        value={roomId}
      >
        <option value="" disabled hidden>
          Select Room
        </option>
        {rooms.map((room) => {
          return (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          );
        })}
      </select>
      <button>Send</button>
    </form>
  );
}

export default EquipmentForm;
