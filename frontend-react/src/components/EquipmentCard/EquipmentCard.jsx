import "./EquipmentCard.css";

function EquipmentCard({ equipment, onDelete, onEdit }) {
  return (
    <div className="equipment-card">
      <h2>
        <b>Equipment name:</b> {equipment.name}
      </h2>
      <p>
        <b>Room name:</b> {equipment.room_name}
      </p>
      <p>
        <b>Equipment status:</b> {equipment.status}
      </p>
      <p>
        <b>Equipment uuid:</b> {equipment.uuid}
      </p>
      <div className="buttons">
        <button className="danger" onClick={() => onDelete(equipment.id)}>
          Delete
        </button>
        <button className="primary" onClick={() => onEdit(equipment)}>
          Edit
        </button>
      </div>
    </div>
  );
}

export default EquipmentCard;
