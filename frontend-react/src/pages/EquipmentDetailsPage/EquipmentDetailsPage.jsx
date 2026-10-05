import { Navigate, useNavigate, useParams } from "react-router-dom";
import API from "../../api/client";
import { useCallback, useEffect, useState } from "react";
import EquipmentCard from "../../components/EquipmentCard/EquipmentCard";
import Spinner from "../../components/Spinner/Spinner";
import "./EquipmentDetailsPage.css";

function EquipmentDetailsPage({ loadAppData }) {
  const navigate = useNavigate();

  const { uuid } = useParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [rooms, setRooms] = useState([]);
  const [equipment, setEquipment] = useState(null);
  const [operations, setOperations] = useState([]);
  const [qrcode, setQrcode] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const equipmentData = await API.getEquipmentByUuid(uuid);
      setEquipment(equipmentData);

      const roomsData = await API.getRooms();
      setRooms(roomsData);

      const equipmentOperations = await API.getOperations(equipmentData.id);
      setOperations(equipmentOperations);

      const qrcodeData = await API.getQRCode(equipmentData.uuid);
      setQrcode(qrcodeData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [uuid]);

  useEffect(() => {
    // Загрузка данных по параметру маршрута: эффект здесь по назначению —
    // синхронизация с адресом, внешних систем нет, каскад ограничен одним циклом.
    // Правильное решение — библиотека данных (react-query), отложено: новая зависимость.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const handleWriteOffEquipment = async (equipmentId) => {
    const isConfirm = window.confirm("Do you really want to write off it?");
    if (!isConfirm) {
      return;
    }
    try {
      await API.writeOffEquipment(equipmentId);
      await loadAppData();
      await loadData();
    } catch (err) {
      setError(err);
    }
  };

  const handleDeleteEquipment = async (equipmentId) => {
    const isConfirm = window.confirm(
      "Delete permanently? The equipment and its operation history will be removed. This cannot be undone",
    );
    if (!isConfirm) {
      return;
    }
    try {
      await API.deleteEquipment(equipmentId);
      await loadAppData();
      navigate("/equipments");
    } catch (err) {
      setError(err);
    }
  };

  const handleMoveEquipment = async (equipmentId, roomId) => {
    try {
      await API.moveEquipment(equipmentId, roomId);
      await loadAppData();
      await loadData();
    } catch (err) {
      setError(err);
    }
  };

  if (loading) return <Spinner />;
  if (error?.status === 404) {
    return <Navigate to="/404" replace />;
  }
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className="equipment_data">
      <EquipmentCard
        equipment={equipment}
        rooms={rooms}
        onDelete={handleDeleteEquipment}
        onWriteOff={handleWriteOffEquipment}
        onMove={handleMoveEquipment}
      />
      <div
        className="qrcode"
        dangerouslySetInnerHTML={{ __html: qrcode }}
      ></div>
      <div className="operations">
        <h1>Operations:</h1>
        {operations.map((op) => {
          return (
            <div key={op.id} className="operation">
              <p>type: {op.type}</p>
              <p>comment: {op.comment}</p>
              <p>created at: {op.created_at}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EquipmentDetailsPage;
