import { useState } from "react";
import "./EquipmentCard.css";

function EquipmentCard({
  equipment,
  rooms,
  onDelete,
  onEdit,
  onWriteOff,
  onMove,
}) {
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const availableRooms = rooms.filter((r) => r.id !== equipment.room_id);
  const canMove =
    availableRooms.length > 0 && equipment.status !== "written_off";

  return (
    <div className="equipment-card">
      <h2>
        <b>Equipment name:</b> {equipment.name}
      </h2>
      <p>
        <b>Room name:</b> {equipment.room_name}
      </p>
      <p>
        <b>Equipment status:</b> {equipment.status}
      </p>
      <p>
        <b>Equipment uuid:</b> {equipment.uuid}
      </p>
      <div className="buttons">
        {canMove && (
          <div className="move-block">
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
            >
              <option value="" disabled>
                Select Room
              </option>
              {availableRooms.map((r) => (
                <option key={r.id} value={Number(r.id)}>
                  {r.name}
                </option>
              ))}
            </select>
            <button
              className="success"
              onClick={() => onMove(equipment.id, Number(selectedRoomId))}
              disabled={!selectedRoomId}
            >
              Move
            </button>
          </div>
        )}

        <button className="primary" onClick={() => onEdit(equipment)}>
          Edit
        </button>
        <button className="warning" onClick={() => onWriteOff(equipment.id)}>
          Write off
        </button>
        <button className="danger" onClick={() => onDelete(equipment.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default EquipmentCard;
