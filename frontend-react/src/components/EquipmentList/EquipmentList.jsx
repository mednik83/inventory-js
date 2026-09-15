import EquipmentCard from "../EquipmentCard/EquipmentCard";
import "./EquipmentList.css";

function EquipmentList({ onDelete, onEdit, equipments, onWriteOff }) {
  return (
    <div className="equipment-list">
      {equipments.map((equipment) => (
        <EquipmentCard
          key={equipment.id}
          equipment={equipment}
          onDelete={onDelete}
          onWriteOff={onWriteOff}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default EquipmentList;
