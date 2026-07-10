import "./App.css";
import API from "./api/client";
import { useEffect, useState } from "react";

import EquipmentList from "./components/EquipmentList/EquipmentList";
import EquipmentForm from "./components/EquipmentForm/EquipmentForm";
import RoomForm from "./components/RoomForm/RoomForm";
import Spinner from "./components/Spinner/Spinner";

function App() {
  const [equipments, setEquipments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  const handleRoomForm = async (name) => {
    setLoading(true);
    try {
      await API.createRoom({ name: name });
      await loadData();
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
      await API.createEquipment(formData);
      await loadData();
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

  return (
    <>
      <div>
        <h1>Inventory</h1>
      </div>
      <EquipmentForm rooms={rooms} handleEquipmentForm={handleEquipmentForm} />
      <RoomForm handleRoomForm={handleRoomForm} />
      {error !== "" ? <span className="error">{error}</span> : null}
      {loading ? (
        <Spinner />
      ) : (
        <EquipmentList
          equipments={equipments}
          onDelete={handleDeleteEquipment}
        />
      )}
    </>
  );
}
export default App;
