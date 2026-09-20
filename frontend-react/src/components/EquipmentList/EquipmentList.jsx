import EquipmentCard from "../EquipmentCard/EquipmentCard";
import "./EquipmentList.css";

function EquipmentList({
  onDelete,
  onEdit,
  equipments,
  onWriteOff,
  onMove,
  rooms,
}) {
  return (
    <div className="equipment-list">
      {equipments.map((equipment) => (
        <EquipmentCard
          key={equipment.id}
          equipment={equipment}
          rooms={rooms}
          onDelete={onDelete}
          onWriteOff={onWriteOff}
          onEdit={onEdit}
          onMove={onMove}
        />
      ))}
    </div>
  );
}

export default EquipmentList;
