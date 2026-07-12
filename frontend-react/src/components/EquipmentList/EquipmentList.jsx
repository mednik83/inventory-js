import EquipmentCard from "../EquipmentCard/EquipmentCard";
import "./EquipmentList.css";

function EquipmentList({ onDelete, onEdit, equipments }) {
  return (
    <div className="equipment-list">
      {equipments.map((equipment) => (
        <EquipmentCard
          key={equipment.id}
          equipment={equipment}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default EquipmentList;
