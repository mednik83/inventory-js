import "./RoomCard.css";

function RoomCard({ room, onDelete, onEdit }) {
  return (
    <div className="room-card">
      <h2>
        <b>Room name: </b> {room.name}
      </h2>
      <div className="buttons">
        {" "}
        <button className="primary" onClick={() => onEdit(room)}>
          Edit
        </button>
        <button className="danger" onClick={() => onDelete(room.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default RoomCard;
