class State {
  #equipments = [];
  #rooms = [];
  #filter = { search: "", status: "", roomId: "" };
  #loading = false;
  #error = null;
  #modal = null;
  #listeners = [];
  // Оповещение
  #notify = () => {
    this.#listeners.forEach((listener) => listener());
  };

  subscribe = (listener) => {
    this.#listeners.push(listener);
    return () => {
      this.#listeners = this.#listeners.filter((l) => l !== listener);
    };
  };

  getEquipments = () => [...this.#equipments];
  getRooms = () => [...this.#rooms];
  getFilter = () => ({ ...this.#filter });
  getLoading = () => this.#loading;
  getError = () => this.#error;

  setEquipments = (equipments) => {
    this.#equipments = [...equipments];
    this.#notify();
  };

  setRooms = (rooms) => {
    this.#rooms = [...rooms];
    this.#notify();
  };

  setFilter = (filter) => {
    this.#filter = { ...this.#filter, ...filter };
    this.#notify();
  };

  setLoading = (loading) => {
    this.#loading = loading;
    this.#notify();
  };

  setError = (error) => {
    this.#error = error;
    this.#notify();
  };
}

export default State;
