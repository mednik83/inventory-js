import { useEffect, useState } from "react";
import "./EquipmentForm.css";

function EquipmentForm({
  rooms,
  handleEquipmentForm,
  editingEquipment,
  startEditEquipment,
}) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    if (editingEquipment) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(editingEquipment.name);
      setStatus(editingEquipment.status);
      setRoomId(editingEquipment.room_id);
    } else {
      setName("");
      setStatus("active");
      setRoomId("");
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
    <form className="equipment-form" onSubmit={handleSubmit}>
      <div className="form_input">
        <label htmlFor="equipment-name">Equipment name</label>
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          id="equipment-name"
          value={name}
          placeholder="name"
          name="name"
        />
      </div>
      <div className="form_input">
        <label htmlFor="equipment-status">Equipment status</label>
        <select
          id="equipment-status"
          name="status"
          onChange={(e) => setStatus(e.target.value)}
          value={status}
        >
          <option value={"active"}>active</option>
          <option value={"inactive"}>inactive</option>
          <option value={"written_off"}>written off</option>
        </select>
      </div>
      <div className="form_input">
        <label htmlFor="equipment-room_id">Equipment room</label>
        <select
          id="equipment-room_id"
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
      </div>
      {editingEquipment ? (
        <div className="buttons">
          <button className="primary">Update</button>
          <button className="warning" onClick={() => startEditEquipment(null)}>
            Cancel
          </button>
        </div>
      ) : (
        <button className="success">Send</button>
      )}
    </form>
  );
}

export default EquipmentForm;
