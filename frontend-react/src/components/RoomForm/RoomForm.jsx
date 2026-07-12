import { useEffect, useState } from "react";
import "./RoomForm.css";

function RoomForm({ handleRoomForm, editingRoom, startEditRoom }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editingRoom) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(editingRoom.name);
    } else {
      setName("");
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
    <form className="room-form" onSubmit={handleSubmit}>
      <div className="form_input">
        <label htmlFor="room-name">Room name</label>
        <input
          id="room-name"
          name="name"
          placeholder="Room name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {editingRoom ? (
        <div className="buttons">
          <button className="primary">Update</button>
          <button className="warning" onClick={() => startEditRoom(null)}>
            Cancel
          </button>
        </div>
      ) : (
        <button className="success">Send</button>
      )}
    </form>
  );
}

export default RoomForm;
