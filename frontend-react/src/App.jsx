import "./App.css";
import API from "./api/client";
import { useEffect, useState } from "react";

import EquipmentList from "./components/EquipmentList/EquipmentList";
import EquipmentForm from "./components/EquipmentForm/EquipmentForm";
import RoomForm from "./components/RoomForm/RoomForm";
import Spinner from "./components/Spinner/Spinner";
import RoomList from "./components/RoomList/RoomList";

function App() {
  const [equipments, setEquipments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editingEquipment, setEditingEquipment] = useState(null);

  const loadData = async () => {
    const [equipments, rooms] = await Promise.all([
      API.getEquipments(),
      API.getRooms(),
    ]);
    setEquipments(equipments);
    setRooms(rooms);
  };

  useEffect(() => {
    const init = async () => {
      try {
        await loadData();
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleRoomForm = async (formData) => {
    setLoading(true);
    try {
      if (editingRoom) {
        await API.updateRoom(editingRoom.id, formData);
      } else {
        await API.createRoom(formData);
      }
      await loadData();
      setEditingRoom(null);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEquipmentForm = async (formData) => {
    setLoading(true);
    try {
      if (editingEquipment) {
        await API.updateEquipment(editingEquipment.id, formData);
      } else {
        await API.createEquipment(formData);
      }
      await loadData();
      setEditingEquipment(null);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEquipment = async (id) => {
    setLoading(true);
    try {
      await API.deleteEquipment(id);
      await loadData();
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    setLoading(true);
    try {
      await API.deleteRoom(id);
      await loadData();
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEditRoom = (room) => {
    return setEditingRoom(room);
  };

  const startEditingEquipment = (equipment) => {
    return setEditingEquipment(equipment);
  };

  return (
    <>
      <div>
        <h1>Inventory</h1>
      </div>
      <EquipmentForm
        rooms={rooms}
        handleEquipmentForm={handleEquipmentForm}
        editingEquipment={editingEquipment}
      />
      <RoomForm handleRoomForm={handleRoomForm} editingRoom={editingRoom} />
      {error !== "" ? <span className="error">{error}</span> : null}
      {loading ? (
        <Spinner />
      ) : (
        <div className="content">
          <EquipmentList
            equipments={equipments}
            onDelete={handleDeleteEquipment}
            onEdit={startEditingEquipment}
          />
          <RoomList
            rooms={rooms}
            onDelete={handleDeleteRoom}
            onEdit={startEditRoom}
          />
        </div>
      )}
    </>
  );
}
export default App;
