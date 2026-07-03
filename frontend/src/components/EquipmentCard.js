export function createEquipmentCard(equipment) {
  const card = document.createElement("div");
  card.className = "equipment-card card";

  card.innerHTML = `
    <h3 class="info">${equipment.name}</h3>
    <p class="info">Room: ${equipment.room_name}</p>
    <p class="info">Status: ${equipment.status}</p>
    <p class="info">UUID: ${equipment.uuid}</p>

    <button data-action="edit" data-id="${equipment.id}" class="button button-primary">Изменить</button>
    <button data-action="qr" data-uuid="${equipment.uuid}" class="button button-secondary">QR</button>
    <button data-action="write-off" data-id="${equipment.id}" class="button button-warning">Списать</button>
    <button data-action="force-delete" data-id="${equipment.id}" class="button button-danger">Удалить навсегда</button>
    `;

  return card;
}
