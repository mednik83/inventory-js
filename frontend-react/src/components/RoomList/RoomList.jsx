import RoomCard from "../RoomCard/RoomCard";

function RoomList({ rooms, onDelete, onEdit }) {
  return (
    <div className="list">
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
