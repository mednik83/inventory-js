"use strict";
// states
let searchQuery = "";
let selectedRoom = "";
let editingId = null;
let equipmentList = [];
let roomList = [];
let roomsById = new Map();

// nodes constants
const searchInput = document.querySelector(".search-input");
const filterRoom = document.querySelector(".filter-room");

const form = document.querySelector(".form");
const selectRoom = document.querySelector(".select-room");
const equipmentListNode = document.querySelector(".list");
const submitButton = form.querySelector("button");
const cancelButton = document.querySelector(".cancel-button");

// const API_URL = "http://localhost:8010";
const API_URL = "http://192.168.88.225:8010";

// API fetch
const roomApi = {
  async fetchRooms() {
    const response = await fetch(`${API_URL}/rooms`);

    if (!response.ok) {
      throw new Error("Faildet to fetch rooms");
    }
    return await response.json();
  },
};

const equipmentApi = {
  async fetchEquipments() {
    const response = await fetch(`${API_URL}/equipments`);

    if (!response.ok) {
      throw new Error("Failed to fetch equipments");
    }

    return await response.json();
  },

  async createEquipment(equipment) {
    const response = await fetch(`${API_URL}/equipments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(equipment),
    });

    if (!response.ok) {
      throw new Error("Failed to create equipment");
    }

    return await response.json();
  },

  async editEquipment(id, equipment) {
    const response = await fetch(`${API_URL}/equipments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(equipment),
    });

    if (!response.ok) {
      throw new Error("Failed to edit equipment");
    }

    return await response.json();
  },

  async removeEquipment(id) {
    const response = await fetch(`${API_URL}/equipments/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete equipment");
    }
  },
};

// utils
const UTILS = {
  resetFormState() {
    editingId = null;
    cancelButton.hidden = true;
    submitButton.textContent = "Add";
    form.reset();
  },

  getFilteredEquipmentList() {
    return equipmentList.filter((eq) => {
      const matchesName = eq.name.toLowerCase().includes(searchQuery);
      const matchesRoom =
        selectedRoom === "" || eq.room_id === Number(selectedRoom);

      return matchesName && matchesRoom;
    });
  },

  startEditing(equipment) {
    if (!equipment) return;

    cancelButton.hidden = false;

    editingId = equipment.id;

    form.elements.name.value = equipment.name;
    form.elements.room.value = String(equipment.room_id);
    form.elements.status.value = equipment.status;

    submitButton.textContent = "Save";
  },
};

const equipmentService = {
  async create(name, room, status) {
    await equipmentApi.createEquipment({ name, room_id: Number(room), status });
    await loadData();
  },
  async update(id, name, room, status) {
    await equipmentApi.editEquipment(id, {
      name,
      room_id: Number(room),
      status,
    });
    await loadData();
  },
  async delete(id) {
    await equipmentApi.removeEquipment(id);
    if (editingId === id) {
      UTILS.resetFormState();
    }
    await loadData();
  },
  getById(id) {
    return equipmentList.find((eq) => eq.id === id);
  },
};

function createEquipmentNode(equipment) {
  const equipmentNode = document.createElement("div");
  equipmentNode.className = "equipment-card";

  const equipmentInfo = document.createElement("div");
  equipmentInfo.className = "equipment-info";

  const equipmentActions = document.createElement("div");
  equipmentActions.className = "equipment-actions";

  const equipmentName = document.createElement("h3");
  const equipmentRoom = document.createElement("p");
  const equipmentStatus = document.createElement("p");

  const deleteButton = document.createElement("button");
  const editButton = document.createElement("button");

  const room = roomsById.get(equipment.room_id);
  equipmentName.textContent = equipment.name;
  equipmentRoom.textContent = `Room: ${room ? room.name : "Unknown room"}`;
  equipmentStatus.textContent = `Status: ${equipment.status}`;

  deleteButton.textContent = "Delete";
  deleteButton.className = "button button-danger";
  deleteButton.dataset.action = "delete";
  deleteButton.dataset.id = equipment.id;

  editButton.textContent = "Edit";
  editButton.className = "button button-secondary";
  editButton.dataset.action = "edit";
  editButton.dataset.id = equipment.id;

  equipmentInfo.append(equipmentName, equipmentRoom, equipmentStatus);
  equipmentActions.append(editButton, deleteButton);

  equipmentNode.append(equipmentInfo, equipmentActions);

  return equipmentNode;
}

// render equipment list
function renderPage() {
  equipmentListNode.innerHTML = "";

  selectRoom.innerHTML = `<option value="">Select room</option>`;
  filterRoom.innerHTML = `<option value="">All rooms</option>`;

  roomList.forEach((room) => {
    const formOption = document.createElement("option");
    formOption.value = String(room.id);
    formOption.textContent = room.name;
    selectRoom.appendChild(formOption);

    const filterOption = document.createElement("option");
    filterOption.value = String(room.id);
    filterOption.textContent = room.name;
    filterRoom.appendChild(filterOption);
  });

  filterRoom.value = selectedRoom;

  const equipments = UTILS.getFilteredEquipmentList();

  if (equipments.length === 0) {
    equipmentListNode.textContent = "No equipment found";
    return;
  }

  equipments.forEach((equipment) => {
    equipmentListNode.appendChild(createEquipmentNode(equipment));
  });
}

// listener for form equipment
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(form);

  const name = data.get("name").trim();
  const roomId = data.get("room").trim();
  const status = data.get("status").trim();

  if (!name || !roomId || !status) {
    alert("Ошибка ввода");
    return;
  }

  if (name.length < 2) {
    alert("Имя слишком короткое");
    return;
  }

  try {
    if (editingId !== null) {
      await equipmentService.update(editingId, name, roomId, status);
    } else {
      await equipmentService.create(name, roomId, status);
    }
    UTILS.resetFormState();
  } catch (err) {
    console.error(err);
    alert("Ошибка при сохранении данных");
  }
});

equipmentListNode.addEventListener("click", async (e) => {
  const button = e.target.closest("button");

  if (!button) return;

  if (button.dataset.action === "delete") {
    try {
      await equipmentService.delete(Number(button.dataset.id));
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении оборудования");
    }
    return;
  }

  if (button.dataset.action === "edit") {
    const id = Number(button.dataset.id);
    const equipment = equipmentService.getById(id);
    if (!equipment) {
      alert("Оборудование не найдено");
      return;
    }
    UTILS.startEditing(equipment);
    return;
  }
});

// listener for search
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase();
  renderPage();
});

// listener for rooms filter
filterRoom.addEventListener("change", (e) => {
  selectedRoom = e.target.value;
  renderPage();
});

cancelButton.addEventListener("click", () => {
  UTILS.resetFormState();
});

async function loadData() {
  try {
    const [equipments, rooms] = await Promise.all([
      equipmentApi.fetchEquipments(),
      roomApi.fetchRooms(),
    ]);

    equipmentList = equipments;
    roomList = rooms;

    roomsById = new Map(roomList.map((room) => [room.id, room]));

    renderPage();
  } catch (err) {
    console.error(err);
    equipmentList = [];
    roomList = [];
    equipmentListNode.textContent = "Failed to load data";
  }
}

loadData();
