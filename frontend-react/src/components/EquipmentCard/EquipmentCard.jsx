function EquipmentCard({ equipment, onDelete }) {
  return (
    <div className="elem">
      <h1>{equipment.name}</h1>
      <p>{equipment.room_name}</p>
      <p>{equipment.status}</p>
      <p>{equipment.uuid}</p>
      <button onClick={() => onDelete(equipment.id)}>Delete</button>
    </div>
  );
}

export default EquipmentCard;
