import { roomApi } from "./api.js";
import { setRooms } from "./state.js";
import { renderRooms } from "./render.js";
import { setupEquipmentHandlers, loadData } from "./handlers.js";

async function init() {
  setupEquipmentHandlers();

  const rooms = await roomApi.getAll();
  setRooms(rooms);
  renderRooms(rooms);

  await loadData();
}

init().catch((error) => {
  console.error(error);
  alert(error.message);
});
