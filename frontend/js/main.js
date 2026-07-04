"use strict";

import { render } from "./render.js";
import State from "./state.js";
import { loadEquipments } from "./ui.js";

function init() {
  const state = new State();
  state.subscribe(() => render(state)); // подписка render на изменения
  loadEquipments(state);
}

init();
