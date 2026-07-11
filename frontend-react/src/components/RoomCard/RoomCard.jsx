function RoomCard({ room, onDelete, onEdit }) {
  return (
    <div className="card">
      <h2>{room.name}</h2>
      <button onClick={() => onDelete(room.id)}>Delete</button>
      <button onClick={() => onEdit(room)}>Edit</button>
    </div>
  );
}

export default RoomCard;
