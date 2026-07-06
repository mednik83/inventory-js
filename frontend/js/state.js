class State {
  #equipments = [];
  #rooms = [];
  #route = "equipments";
  #filter = { search: "", status: "", roomId: "" };
  #loading = false;
  #error = null;
  #modal = {
    mode: null,
    item: null,
    submitting: false,
    error: null,
  };
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
  getModal = () => ({ ...this.#modal });
  getRoute = () => this.#route;

  setEquipments = (equipments) => {
    this.#equipments = [...equipments];
    this.#notify();
  };

  setRoute = (route) => {
    this.#route = route;
    this.setModal({
      mode: null,
      item: null,
      submitting: false,
      error: null,
    });
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

  setModal = (modal) => {
    this.#modal = {
      ...this.#modal,
      ...modal,
    };
    this.#notify();
  };
}

export default State;
