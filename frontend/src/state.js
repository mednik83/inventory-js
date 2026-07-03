export const state = {
  equipments: [],
  rooms: [],
  filters: {
    search: "",
    roomId: "",
    status: "",
    showWrittenOff: false,
  },
  editingEquipmentId: null,
};

export function setEquipments(equipments) {
  state.equipments = equipments;
}

export function setRooms(rooms) {
  state.rooms = rooms;
}

export function setFilter(name, value) {
  state.filters[name] = value;
}

export function setEditingEquipmentId(id) {
  state.editingEquipmentId = id;
}
