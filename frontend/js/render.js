import {
  deleteEquipment,
  createEquipment,
  getQRCode,
  deleteRoom,
  createRoom,
} from "./ui.js";

export function render(state) {
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.append(renderNav());

  if (state.getLoading()) {
    app.appendChild(showSpinner());
    return;
  }

  if (state.getError()) {
    app.appendChild(showError(state.getError()));
    return;
  }

  const content = document.createElement("div");

  const route = state.getRoute();

  if (route === "equipments") {
    const equipments = state.getEquipments();

    content.append(renderEquipmentForm(state));

    if (equipments.length !== 0) {
      content.append(renderEquipments(state, equipments));
    } else {
      content.append(showEmpty());
    }
  } else if (route === "rooms") {
    const rooms = state.getRooms();

    content.append(renderRoomForm(state));

    if (rooms.length !== 0) {
      content.append(renderRooms(state, rooms));
    } else {
      content.append(showEmpty());
    }
  } else {
    content.append(showError("Page not found"));
  }

  app.append(content);
}

function renderNav() {
  const nav = document.createElement("nav");
  nav.classList.add("links");
  nav.innerHTML = `
        <a href="#equipments">Equipments</a>
        <a href="#rooms">Rooms</a>
    `;
  return nav;
}

function showEmpty() {
  const empty = document.createElement("div");
  empty.innerHTML = "Empty result";
  return empty;
}

function showError(error) {
  const errorNode = document.createElement("p");
  errorNode.textContent = error;
  return errorNode;
}

function showSpinner() {
  const spinner = document.createElement("span");
  spinner.textContent = "Loading...";
  return spinner;
}

function renderEquipment(state, equipment) {
  const equipmentItem = document.createElement("div");
  equipmentItem.classList.add("equipment");

  const leftData = document.createElement("div");
  leftData.classList.add("equipment_left");
  const rightData = document.createElement("div");
  rightData.classList.add("equipment_right");

  leftData.innerHTML = `<div>
    <h2>Name: ${equipment.name}</h2>
    <p>Room name: ${equipment.room_name}</p>
    <p>Status: ${equipment.status}</p>
    <p>UUID: ${equipment.uuid}</p>
    </div>
    `;

  const qrContainer = document.createElement("div");
  qrContainer.classList.add("qrcontainer");
  leftData.appendChild(qrContainer);

  const deleteButton = createButton("Delete");
  deleteButton.addEventListener("click", () => {
    deleteEquipment(state, equipment.id);
  });

  const updateButton = createButton("Update");
  updateButton.addEventListener("click", () => {
    return;
  });

  const getQRCodeButton = createButton("Get QRCode");
  getQRCodeButton.addEventListener("click", async () => {
    try {
      const QRSvg = await getQRCode(equipment.uuid);
      qrContainer.innerHTML = QRSvg;
    } catch {
      qrContainer.textContent = "Error loading QRCode";
    }
  });

  rightData.append(deleteButton, updateButton, getQRCodeButton);

  equipmentItem.append(leftData, rightData);

  return equipmentItem;
}

function renderRoom(state, room) {
  const roomItem = document.createElement("div");
  roomItem.classList.add("room");

  const roomLeft = document.createElement("div");
  roomLeft.classList.add("room_left");
  const roomRight = document.createElement("div");
  roomRight.classList.add("room_right");

  roomLeft.innerHTML = `
    <h2>${room.name}</h2>
    `;

  const deleteButton = createButton("Delete");
  deleteButton.addEventListener("click", () => {
    deleteRoom(state, room.id);
  });

  const updateButton = createButton("Update");
  updateButton.addEventListener("click", () => {
    return;
  });

  roomRight.append(deleteButton, updateButton);

  roomItem.append(roomLeft, roomRight);

  return roomItem;
}

function renderRooms(state, rooms) {
  const roomsList = document.createElement("div");

  rooms.forEach((room) => {
    roomsList.appendChild(renderRoom(state, room));
  });

  return roomsList;
}

function renderEquipments(state, equipments) {
  const equipmentsList = document.createElement("div");

  equipments.forEach((equipment) => {
    equipmentsList.appendChild(renderEquipment(state, equipment));
  });

  return equipmentsList;
}

function createButton(buttonName) {
  const button = document.createElement("button");
  button.classList.add("button");
  button.textContent = buttonName;
  return button;
}

function renderEquipmentForm(state) {
  const formDiv = document.createElement("div");
  formDiv.classList.add("form_div");
  const modal = state.getModal();

  if (modal.submitting) {
    formDiv.appendChild(showSpinner());
    return formDiv;
  }

  const formNode = document.createElement("form");
  formNode.classList.add("form_equipment");

  const nameInput = document.createElement("input");
  nameInput.placeholder = "Equipment name";
  nameInput.type = "text";
  nameInput.name = "name";

  const statusSelect = document.createElement("select");
  statusSelect.name = "status";
  const allowedStatuses = ["active", "inactive", "written_off"];
  allowedStatuses.forEach((status) => {
    const statusOption = document.createElement("option");
    statusOption.textContent = status;
    statusOption.value = status;
    statusSelect.appendChild(statusOption);
  });

  const roomSelect = document.createElement("select");
  roomSelect.name = "room_id";
  const rooms = state.getRooms();
  rooms.forEach((room) => {
    const roomOption = document.createElement("option");
    roomOption.textContent = room.name;
    roomOption.value = room.id;
    roomSelect.appendChild(roomOption);
  });

  const button = createButton("Send");
  formNode.onsubmit = async (e) => {
    e.preventDefault();

    let name = e.target.name.value.trim();
    let status = e.target.status.value.trim();
    let roomId = e.target.room_id.value.trim();

    const formData = {
      name: name,
      status: status,
      room_id: roomId,
    };

    await createEquipment(state, formData);
  };

  const errorNode = document.createElement("span");
  errorNode.classList.add("form-error");
  if (modal.error) {
    errorNode.textContent = modal.error;
  }

  formNode.append(nameInput, statusSelect, roomSelect, button);
  formDiv.append(formNode, errorNode);

  return formDiv;
}

function renderRoomForm(state) {
  const formDiv = document.createElement("div");
  formDiv.classList.add("form_div");
  const modal = state.getModal();

  if (modal.submitting) {
    formDiv.appendChild(showSpinner());
    return formDiv;
  }

  const formNode = document.createElement("form");
  formNode.classList.add("form_room");

  const nameInput = document.createElement("input");
  nameInput.placeholder = "Room name";
  nameInput.name = "name";
  nameInput.type = "text";

  const button = createButton("Send");

  formNode.onsubmit = async (e) => {
    e.preventDefault();

    let name = e.target.name.value.trim();

    const formData = {
      name: name,
    };

    await createRoom(state, formData);
  };

  const errorNode = document.createElement("span");
  errorNode.classList.add("form-error");
  if (modal.error) {
    errorNode.textContent = modal.error;
  }

  formNode.append(nameInput, button);
  formDiv.append(formNode, errorNode);

  return formDiv;
}
