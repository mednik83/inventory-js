import RoomForm from "../../components/RoomForm/RoomForm";
import RoomList from "../../components/RoomList/RoomList";
import Spinner from "../../components/Spinner/Spinner";

function RoomPage({
  handleRoomForm,
  editingRoom,
  error,
  loading,
  rooms,
  handleDeleteRoom,
  startEditRoom,
}) {
  return (
    <>
      <RoomForm handleRoomForm={handleRoomForm} editingRoom={editingRoom} />
      {error !== "" ? <span className="error">{error}</span> : null}
      {loading ? (
        <Spinner />
      ) : rooms.length === 0 ? (
        <h2>No content</h2>
      ) : (
        <RoomList
          rooms={rooms}
          onDelete={handleDeleteRoom}
          onEdit={startEditRoom}
          editingRoom={editingRoom}
        />
      )}
    </>
  );
}

export default RoomPage;
