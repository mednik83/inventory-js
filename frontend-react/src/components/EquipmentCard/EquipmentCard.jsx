function EquipmentCard({ equipment, onDelete, onEdit }) {
  return (
    <div className="elem">
      <h1>{equipment.name}</h1>
      <p>{equipment.room_name}</p>
      <p>{equipment.status}</p>
      <p>{equipment.uuid}</p>
      <button onClick={() => onDelete(equipment.id)}>Delete</button>
      <button onClick={() => onEdit(equipment)}>Edit</button>
    </div>
  );
}

export default EquipmentCard;
