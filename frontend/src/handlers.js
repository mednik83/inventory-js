import { equipmentApi, roomApi } from "./api.js";
import { state, setEquipments, setFilter, setRooms } from "./state.js";
import {
  clearError,
  renderEquipments,
  renderQr,
  renderRooms,
  showError,
} from "./render.js";
import { dom } from "./dom.js";

export async function loadData() {
  const params = buildEquipmentQueryParams();

  const equipments = await equipmentApi.getAll(params);

  const rooms = await roomApi.getAll();

  setEquipments(equipments);
  setRooms(rooms);

  renderRooms(rooms);
  renderEquipments(state.equipments);
}

function buildEquipmentQueryParams() {
  const params = {};

  if (state.filters.search) {
    params.search = state.filters.search;
  }

  if (state.filters.roomId) {
    params.room_id = state.filters.roomId;
  }

  if (state.filters.status) {
    params.status = state.filters.status;
  }

  if (!state.filters.showWrittenOff) {
    params.exclude_status = "written_off";
  }

  return params;
}

export function setupEquipmentHandlers() {
  dom.equipmentForm.addEventListener("submit", handleEquipmentSubmit);
  dom.roomForm.addEventListener("submit", handleRoomSubmit);

  dom.equipmentList.addEventListener("click", handleEquipmentListClick);

  dom.searchInput.addEventListener("input", async (event) => {
    setFilter("search", event.target.value);
    await loadData();
  });

  dom.roomFilterSelect.addEventListener("change", async (event) => {
    setFilter("roomId", event.target.value);
    await loadData();
  });

  // dom.statusFilterSelect.addEventListener("change", async (event) => {
  //   setFilter("status", event.target.value);
  //   await loadEquipments();
  // });

  // dom.showWrittenOffCheckbox.addEventListener("change", async (event) => {
  //   setFilter("showWrittenOff", event.target.checked);
  //   await loadEquipments();
  // });
}

async function handleEquipmentSubmit(event) {
  event.preventDefault();

  clearError(dom.equipmentErrorForm);

  const data = {
    name: dom.equipmentNameInput.value.trim(),
    room_id: Number(dom.equipmentRoomSelect.value),
    status: dom.equipmentStatusSelect.value,
  };

  try {
    await equipmentApi.create(data);
    dom.equipmentForm.reset();

    await loadData();
  } catch (error) {
    showError(dom.equipmentErrorForm, error.message);
  }
}

async function handleRoomSubmit(event) {
  event.preventDefault();

  clearError(dom.roomErrorForm);

  const data = {
    name: dom.roomNameInput.value.trim(),
  };

  try {
    await roomApi.create(data);
    dom.roomForm.reset();

    await loadData();
  } catch (error) {
    showError(dom.roomErrorForm, error.message);
  }
}

async function handleEquipmentListClick(event) {
  const button = event.target.closest("button");

  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;
  const uuid = button.dataset.uuid;

  if (action === "write-off") {
    await equipmentApi.writeOff(id);
    await loadData();
  }

  if (action === "force-delete") {
    const confirmed = confirm("Удалить оборудование навсегда?");

    if (!confirmed) return;

    await equipmentApi.forceDelete(id);
    await loadData();
  }

  if (action === "qr") {
    const svg = await equipmentApi.getQr(uuid);
    renderQr(svg);
  }
}
