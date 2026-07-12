import EquipmentList from "../../components/EquipmentList/EquipmentList";
import EquipmentForm from "../../components/EquipmentForm/EquipmentForm";
import Spinner from "../../components/Spinner/Spinner";
import Search from "../../components/Search/Search";

function EquipmentPage({
  rooms,
  handleEquipmentForm,
  editingEquipment,
  equipments,
  handleDeleteEquipment,
  startEditEquipment,
  error,
  loading,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <>
      <EquipmentForm
        rooms={rooms}
        handleEquipmentForm={handleEquipmentForm}
        editingEquipment={editingEquipment}
        startEditEquipment={startEditEquipment}
      />
      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {error !== "" ? <span className="error">{error}</span> : null}
      {loading ? (
        <Spinner />
      ) : equipments.length === 0 ? (
        <h2>No content</h2>
      ) : (
        <EquipmentList
          onDelete={handleDeleteEquipment}
          onEdit={startEditEquipment}
          equipments={equipments}
        />
      )}
    </>
  );
}

export default EquipmentPage;
