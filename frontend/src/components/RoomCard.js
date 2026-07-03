export function createRoomCard(room) {
  const card = document.createElement("div");
  card.className = "room-card card";

  card.innerHTML = `
    <h3>${room.name}</h3>
    `;

  return card;
}
