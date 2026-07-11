import EquipmentList from "../../components/EquipmentList/EquipmentList";
import EquipmentForm from "../../components/EquipmentForm/EquipmentForm";
import Spinner from "../../components/Spinner/Spinner";

function EquipmentPage({
  rooms,
  handleEquipmentForm,
  editingEquipment,
  equipments,
  handleDeleteEquipment,
  startEditEquipment,
  error,
  loading,
}) {
  return (
    <>
      <EquipmentForm
        rooms={rooms}
        handleEquipmentForm={handleEquipmentForm}
        editingEquipment={editingEquipment}
      />
      {error !== "" ? <span className="error">{error}</span> : null}
      {loading ? (
        <Spinner />
      ) : equipments.length === 0 ? (
        <h2>No content</h2>
      ) : (
        <EquipmentList
          equipments={equipments}
          onDelete={handleDeleteEquipment}
          onEdit={startEditEquipment}
          editingEquipment={editingEquipment}
        />
      )}
    </>
  );
}

export default EquipmentPage;
