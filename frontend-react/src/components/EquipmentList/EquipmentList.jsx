import EquipmentCard from "../EquipmentCard/EquipmentCard";

function EquipmentList({ equipments, onDelete, onEdit }) {
  return (
    <div className="list">
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
