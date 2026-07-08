import API from "./api.js";

export async function loadData(state) {
  state.setError(null);
  state.setLoading(true);
  try {
    const [equipments, rooms] = await Promise.all([
      API.getEquipments(),
      API.getRooms(),
    ]);
    state.setEquipments(equipments);
    state.setRooms(rooms);
  } catch (err) {
    state.setError(err.message);
  } finally {
    state.setLoading(false);
  }
}

export async function createEquipment(state, formData) {
  if (formData.name === "" || !formData.status || !formData.room_id) {
    state.setModal({
      mode: "create",
      item: formData,
      error: "Invalid equipment data",
    });
    return;
  }

  state.setModal({
    submitting: true,
    error: null,
  });

  try {
    await API.createEquipment(formData);
    await loadData(state);
  } catch (err) {
    state.setModal({
      error: err.message,
    });
  } finally {
    state.setModal({
      submitting: false,
    });
  }
}

export async function createRoom(state, formData) {
  if (formData.name === "") {
    state.setModal({
      mode: "create",
      item: formData,
      error: "Invalid room data",
    });
    return;
  }
  state.setModal({
    submitting: true,
    error: null,
  });
  try {
    await API.createRoom(formData);
    await loadData(state);
  } catch (err) {
    state.setModal({
      error: err.message,
    });
  } finally {
    state.setModal({
      submitting: false,
    });
  }
}

export async function deleteEquipment(state, id) {
  if (!confirm("Вы действительно хотите удалить оборудование?")) {
    return;
  }
  try {
    await API.deleteEquipment(id);
    await loadData(state);
  } catch (err) {
    state.setError(err.message);
  }
}

export async function deleteRoom(state, id) {
  if (!confirm("Вы действительно хотите удалить комнату?")) {
    return;
  }
  try {
    await API.deleteRoom(id);
    await loadData(state);
  } catch (err) {
    state.setError(err.message);
  }
}

export async function getQRCode(uuid) {
  try {
    const svg = await API.getQRCode(uuid);
    return svg;
  } catch (err) {
    throw new Error("Не удалось загрузить QRCode");
  }
}

export async function writteOffEquipment(state, id) {
  if (!confirm("Вы действительно хотите списать оборудование?")) {
    return;
  }
  try {
    await API.writenOffEquipment(id);
    await loadData(state);
  } catch (err) {
    state.setError(err.message);
  }
}

export async function updateEquipment(state, id, formData) {
  if (formData.name === "" || !formData.status || !formData.room_id) {
    state.setModal({
      error: "incorrect equipment data",
      submitting: false,
    });
    return;
  }

  state.setModal({
    submitting: true,
    error: null,
  });

  try {
    await API.updateEquipment(id, formData);
    await loadData(state);
    state.setModal({
      mode: "create",
      item: null,
    });
  } catch (err) {
    state.setModal({
      error: err.message,
    });
  } finally {
    state.setModal({
      submitting: false,
    });
  }
}

export async function updateRoom(state, id, formData) {
  if (formData.name === "") {
    state.setModal({
      error: "incorrect room data",
      submitting: false,
    });
    return;
  }

  state.setModal({
    submitting: true,
    error: null,
  });

  try {
    await API.updateRoom(id, formData);
    await loadData(state);
    state.setModal({
      mode: "create",
      item: null,
    });
  } catch (err) {
    state.setModal({
      error: err.message,
    });
  } finally {
    state.setModal({
      submitting: false,
    });
  }
}

export function startEdit(state, item) {
  state.setModal({
    mode: "edit",
    item: item,
    submitting: false,
  });
  return;
}
