import "./App.css";
import API from "./api/client";
import { useEffect, useState } from "react";

import EquipmentList from "./components/EquipmentList/EquipmentList";
import EquipmentForm from "./components/EquipmentForm/EquipmentForm";
import RoomForm from "./components/RoomForm/RoomForm";
import Spinner from "./components/Spinner/Spinner";
import RoomList from "./components/RoomList/RoomList";
import Nav from "./components/Nav/Nav";
import { Route, Routes } from "react-router-dom";

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
    setEditingRoom(room);
  };

  const startEditEquipment = (equipment) => {
    setEditingEquipment(equipment);
  };

  return (
    <>
      <div>
        <h1>Inventory</h1>
      </div>
      <Nav />

      <Routes>
        <Route
          path="/equipments"
          element={
            <>
              <EquipmentForm
                rooms={rooms}
                handleEquipmentForm={handleEquipmentForm}
                editingEquipment={editingEquipment}
              />
              {error !== "" ? <span className="error">{error}</span> : null}
              {loading ? (
                <Spinner />
              ) : (
                <EquipmentList
                  equipments={equipments}
                  onDelete={handleDeleteEquipment}
                  onEdit={startEditEquipment}
                  editingEquipment={editingEquipment}
                />
              )}
            </>
          }
        ></Route>
        <Route
          path="/rooms"
          element={
            <>
              <RoomForm
                handleRoomForm={handleRoomForm}
                editingRoom={editingRoom}
              />
              {error !== "" ? <span className="error">{error}</span> : null}
              {loading ? (
                <Spinner />
              ) : (
                <RoomList
                  rooms={rooms}
                  onDelete={handleDeleteRoom}
                  onEdit={startEditRoom}
                  editingRoom={editingRoom}
                />
              )}
            </>
          }
        ></Route>
      </Routes>
    </>
  );
}
export default App;
