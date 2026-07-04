export function render(state) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  if (state.getLoading()) {
    app.appendChild(showSpinner());

    return;
  }

  if (state.getError()) {
    app.appendChild(showError(state.getError()));

    return;
  }

  const equipments = state.getEquipments();

  if (equipments.length === 0) {
    app.appendChild(showEmpty());

    return;
  }

  app.appendChild(renderEquipments(equipments));
}

function showEmpty() {
  const empty = document.createElement("div");
  empty.innerHTML = "Empty";
  return empty;
}

function showError(error) {
  const errorNode = document.createElement("p");
  errorNode.textContent = error;
  return errorNode;
}

function showSpinner() {
  const spinner = document.createElement("span");
  spinner.textContent = "...";
  return spinner;
}

function renderEquipment(equipment) {
  const equipmentItem = document.createElement("div");

  equipmentItem.innerHTML = `
    <h2>Name: ${equipment.name}</h2>
    <p>Room id: ${equipment.room_id}</p>
    <p>UUID: ${equipment.uuid}</p>
    `;

  return equipmentItem;
}

function renderEquipments(equipments) {
  const equipmentsList = document.createElement("div");

  equipments.forEach((equipment) => {
    equipmentsList.appendChild(renderEquipment(equipment));
  });

  return equipmentsList;
}
