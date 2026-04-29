"use strict";
// states
let searchQuery = "";
let selectedRoom = "";
let editingId = null;

// data constants
const rooms = ["1", "2", "3", "4", "5"];

// nodes constants
const searchInput = document.querySelector(".search-input");
const filterRoom = document.querySelector(".filter-room");

const form = document.querySelector(".form");
const selectRoom = document.querySelector(".select-room");
const equipmentListNode = document.querySelector(".list");
const submitButton = form.querySelector("button");
const cancelButton = document.querySelector(".cancel-button");

// Equipment storage
const storage = {
  localStorageKey: "equipmentList",
  equipmentList: [],
  getEquipmentList() {
    return this.equipmentList;
  },
  getEquipment(id) {
    return this.equipmentList.find((eq) => eq.id === id);
  },
  addEquipment(equipment) {
    this.equipmentList.push(equipment);
    this.saveToLocalStorage();
  },
  deleteEquipment(id) {
    this.equipmentList = this.equipmentList.filter((eq) => eq.id !== id);
    this.saveToLocalStorage();
  },
  saveToLocalStorage() {
    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(this.equipmentList),
    );
  },
  updateEquipment(equipment) {
    this.equipmentList = this.equipmentList.map((eq) => {
      return eq.id === equipment.id ? equipment : eq;
    });
    this.saveToLocalStorage();
  },
  loadFromLocalStorage() {
    try {
      const equipments = JSON.parse(localStorage.getItem(this.localStorageKey));
      this.equipmentList = Array.isArray(equipments) ? equipments : [];
    } catch {
      this.equipmentList = [];
    }
  },
};
storage.loadFromLocalStorage();

// create form select
rooms.forEach((room) => {
  const formOption = document.createElement("option");
  formOption.value = room;
  formOption.textContent = room;
  selectRoom.appendChild(formOption);

  const filterOption = document.createElement("option");
  filterOption.value = room;
  filterOption.textContent = room;
  filterRoom.appendChild(filterOption);
});

// equipment crud
function addEquipment(name, room, status) {
  const equipment = {
    id: Date.now(),
    name,
    room,
    status,
  };

  storage.addEquipment(equipment);
  renderEquipmentList();
}

function updateEquipment(id, name, room, status) {
  const equipment = {
    id,
    name,
    room,
    status,
  };
  storage.updateEquipment(equipment);
  renderEquipmentList();
}

function deleteEquipment(id) {
  storage.deleteEquipment(id);

  if (editingId === id) {
    resetFormState();
  }
  renderEquipmentList();
}

function getEquipmentById(id) {
  return storage.getEquipment(id);
}

// utils
function resetFormState() {
  editingId = null;
  cancelButton.hidden = true;
  submitButton.textContent = "Add";
  form.reset();
}

function getFilteredEquipmentList() {
  return storage.getEquipmentList().filter((eq) => {
    const matchesName = eq.name.toLowerCase().includes(searchQuery);
    const matchesRoom = selectedRoom === "" || eq.room === selectedRoom;

    return matchesName && matchesRoom;
  });
}

function startEditing(equipment) {
  if (!equipment) return;

  cancelButton.hidden = false;

  editingId = equipment.id;

  form.elements.name.value = equipment.name;
  form.elements.room.value = equipment.room;
  form.elements.status.value = equipment.status;

  submitButton.textContent = "Save";
}

function createEquipmentNode(equipment) {
  const equipmentNode = document.createElement("div");
  equipmentNode.className = "equipment";

  const equipmentName = document.createElement("h3");
  const equipmentRoom = document.createElement("p");
  const equipmentStatus = document.createElement("p");
  const deleteButton = document.createElement("button");
  const editButton = document.createElement("button");

  equipmentName.textContent = equipment.name;
  equipmentRoom.textContent = `Room: ${equipment.room}`;
  equipmentStatus.textContent = `Status: ${equipment.status}`;

  deleteButton.textContent = "Delete";
  deleteButton.dataset.action = "delete";
  deleteButton.dataset.id = equipment.id;

  editButton.textContent = "Edit";
  editButton.dataset.action = "edit";
  editButton.dataset.id = equipment.id;

  equipmentNode.append(
    equipmentName,
    equipmentRoom,
    equipmentStatus,
    deleteButton,
    editButton,
  );

  return equipmentNode;
}

// render equipment list
function renderEquipmentList() {
  equipmentListNode.innerHTML = "";
  const equipments = getFilteredEquipmentList();

  if (equipments.length === 0) {
    equipmentListNode.textContent = "No equipment found";
    return;
  }

  equipments.forEach((equipment) => {
    equipmentListNode.appendChild(createEquipmentNode(equipment));
  });
}

// listener for form equipment
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);

  const name = data.get("name").trim();
  const room = data.get("room").trim();
  const status = data.get("status").trim();

  if (!name || !room || !status) {
    alert("Ошибка ввода");
    return;
  }

  if (name.length < 2) {
    alert("Имя слишком короткое");
    return;
  }

  if (editingId !== null) {
    updateEquipment(editingId, name, room, status);
    resetFormState();
  } else {
    addEquipment(name, room, status);
    resetFormState();
  }
});

equipmentListNode.addEventListener("click", (e) => {
  const button = e.target.closest("button");

  if (!button) return;

  if (button.dataset.action === "delete") {
    deleteEquipment(Number(button.dataset.id));
    return;
  }

  if (button.dataset.action === "edit") {
    const id = Number(button.dataset.id);
    const equipment = getEquipmentById(id);

    startEditing(equipment);
    return;
  }
});

// listener for search
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase();
  renderEquipmentList();
});

// listener for rooms filter
filterRoom.addEventListener("change", (e) => {
  selectedRoom = e.target.value;
  renderEquipmentList();
});

cancelButton.addEventListener("click", () => {
  resetFormState();
});

// init
renderEquipmentList();
