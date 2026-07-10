import EquipmentCard from "../EquipmentCard/EquipmentCard";

function EquipmentList({ equipments, onDelete }) {
  return (
    <div className="list">
      {equipments.map((equipment) => (
        <EquipmentCard
          key={equipment.id}
          equipment={equipment}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default EquipmentList;
