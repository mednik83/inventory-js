import API from "./api.js";

export async function loadEquipments(state) {
  state.setError(null);
  state.setLoading(true);
  try {
    const data = await API.getEquipments();
    state.setEquipments(data);
  } catch (err) {
    state.setError(err.message);
  } finally {
    state.setLoading(false);
  }
}

export async function loadRooms(state) {
  state.setError(null);
  state.setLoading(true);
  try {
    const data = await API.getRooms();
    state.setRooms(data);
  } catch (err) {
    state.setError(err.message);
  } finally {
    state.setLoading(false);
  }
}

export async function createEquipment(state, formData) {
  state.setLoading(true);
  try {
    await API.createEquipment(formData);
    await loadEquipments();
  } catch (err) {
    state.setError(err.message);
  } finally {
    state.setLoading(false);
  }
}
