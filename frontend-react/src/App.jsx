import "./App.css";
import API from "./api/client";
import { useEffect, useMemo, useState } from "react";

import Nav from "./components/Nav/Nav";
import { Navigate, Route, Routes } from "react-router-dom";
import EquipmentPage from "./pages/EquipmentPage/EquipmentPage";
import RoomPage from "./pages/RoomPage/RoomPage";
import NotFoundPage from "./pages/404/404";

function App() {
  const [equipments, setEquipments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredEquipments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return equipments;
    }
    return equipments.filter((eq) => eq.name.toLowerCase().includes(query));
  }, [equipments, searchQuery]);

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
    const isConfirm = window.confirm("Do you really want to delete it?");
    if (!isConfirm) {
      return;
    }
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

  const handleWriteOffEquipment = async (id) => {
    setLoading(true);
    try {
      await API.writeOffEquipment(id);
      await loadData();
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    const isConfirm = window.confirm("Do you really want to delete it?");
    if (!isConfirm) {
      return;
    }
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
    <div className="app">
      <div className="header">
        <h1>Inventory</h1>
      </div>
      <Nav />

      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/equipments" replace />} />
          <Route
            path="/equipments"
            element={
              <EquipmentPage
                rooms={rooms}
                handleEquipmentForm={handleEquipmentForm}
                editingEquipment={editingEquipment}
                equipments={filteredEquipments}
                handleDeleteEquipment={handleDeleteEquipment}
                handleWriteOffEquipment={handleWriteOffEquipment}
                startEditEquipment={startEditEquipment}
                error={error}
                loading={loading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            }
          />
          <Route
            path="/rooms"
            element={
              <RoomPage
                handleRoomForm={handleRoomForm}
                editingRoom={editingRoom}
                error={error}
                loading={loading}
                rooms={rooms}
                handleDeleteRoom={handleDeleteRoom}
                startEditRoom={startEditRoom}
              />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;
