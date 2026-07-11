import RoomCard from "../RoomCard/RoomCard";
import "./RoomList.css";

function RoomList({ rooms, onDelete, onEdit }) {
  return (
    <div className="room-list">
      {rooms.map((room) => {
        return (
          <RoomCard
            key={room.id}
            room={room}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        );
      })}
    </div>
  );
}

export default RoomList;
