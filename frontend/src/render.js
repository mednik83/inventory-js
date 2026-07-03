import { createEquipmentCard } from "./components/EquipmentCard.js";
import { createRoomCard } from "./components/RoomCard.js";
import { dom } from "./dom.js";

export function renderEquipments(equipments) {
  dom.equipmentList.innerHTML = "";

  if (equipments.length === 0) {
    dom.equipmentList.innerHTML = "<p>Equipments not found</p>";
    return;
  }

  for (const equipment of equipments) {
    const item = createEquipmentCard(equipment);
    dom.equipmentList.append(item);
  }
}

export function showError(elem, message) {
  elem.textContent = message;
  elem.hidden = false;
}

export function clearError(elem) {
  elem.textContent = "";
  elem.hidden = true;
}

export function renderRooms(rooms) {
  dom.roomList.innerHTML = "";
  dom.roomFilterSelect.innerHTML = `<option value="">All rooms</option>`;

  for (const room of rooms) {
    const card = createRoomCard(room);

    const option = document.createElement("option");
    option.value = room.id;
    option.textContent = room.name;

    dom.equipmentRoomSelect.append(option.cloneNode(true));
    dom.roomFilterSelect.append(option);

    dom.roomList.append(card);
  }
}

export function renderQr(svg) {
  dom.qrContainer.innerHTML = svg;
}
