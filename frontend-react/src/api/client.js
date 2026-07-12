const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8010";

async function request(url, options = {}) {
  const defaultHeaders = { "Content-Type": "application/json" };
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Ошибка ${res.status}`);
  }

  if (res.status === 204) return null;

  return await res.json();
}

const API = {
  getEquipmentById: async (id) => request(`/equipments/${id}`),

  getEquipmentByUuid: async (uuid) => request(`/equipments/uuid/${uuid}`),

  getEquipments: async () => request(`/equipments`),

  createEquipment: async (data) =>
    request(`/equipments`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateEquipment: async (id, data) =>
    request(`/equipments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteEquipment: async (id) =>
    request(`/equipments/${id}/delete`, {
      method: "DELETE",
    }),

  writenOffEquipment: async (id) =>
    request(`/equipments/${id}`, { method: "PATCH" }),

  getQRCode: async (uuid) => {
    const res = await fetch(`${BASE_URL}/equipments/uuid/${uuid}/qr`);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.text();
  },

  getRooms: async () => request(`/rooms`),

  getRoomById: async (id) => request(`/rooms/${id}`),

  createRoom: async (data) =>
    request(`/rooms`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateRoom: async (id, data) =>
    request(`/rooms/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteRoom: async (id) => request(`/rooms/${id}`, { method: "DELETE" }),
};

export default API;
