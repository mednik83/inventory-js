const API_URL = "http://localhost:8010";

async function request(path, oprions = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...oprions.headers,
    },
    ...oprions,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();

      if (errorData.message) {
        message = errorData.message;
      }
    } catch {
      message = "Server returned an invalid error response";
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

class EquipmentApi {
  getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/equipments${query ? `?${query}` : ""}`);
  }

  getByUuid(uuid) {
    return request(`/equipments/uuid/${uuid}`);
  }

  create(data) {
    return request("/equipments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  update(id, data) {
    return request(`/equipments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  writeOff(id) {
    return request(`/equipments/${id}`, {
      method: "PATCH",
    });
  }

  forceDelete(id) {
    return request(`/equipments/${id}/delete`, {
      method: "DELETE",
    });
  }

  async getQr(uuid) {
    return await fetch(`${API_URL}/equipments/uuid/${uuid}/qr`).then((res) => {
      if (!res.ok) {
        throw new Error("Failed to load QR");
      }

      return res.text();
    });
  }
}

export const equipmentApi = new EquipmentApi();

class RoomApi {
  getAll() {
    return request("/rooms");
  }

  create(data) {
    return request(`/rooms`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  update(id, data) {
    return request(`/rooms/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  delete(id) {
    return request(`/rooms/${id}`, {
      method: "DELETE",
    });
  }
}

export const roomApi = new RoomApi();
