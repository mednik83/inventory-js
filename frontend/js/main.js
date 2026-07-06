"use strict";

import { render } from "./render.js";
import State from "./state.js";
import { loadData } from "./ui.js";

function getRouteFromHash() {
  return location.hash.slice(1) || "equipments";
}

function init() {
  const state = new State();
  state.subscribe(() => render(state)); // подписка render на изменения

  window.addEventListener("hashchange", () => {
    state.setRoute(getRouteFromHash());
  });

  state.setRoute(getRouteFromHash());
  loadData(state);
}

init();
