"use strict";

const express = require("express");
const cors = require("cors");

const app = express(); // init server

app.use(cors());
app.use(express.json()); //  json response

const host = "localhost";
const port = 8010;

// db
class Equipment {
  constructor(name, room, status) {
    this.id = Date.now();
    this.name = name;
    this.room = room;
    this.status = status;
  }
  update(name, room, status) {
    this.name = name;
    this.room = room;
    this.status = status;
  }
}

class EquipmentList {
  equipments = [];
  getList() {
    return this.equipments;
  }
  getById(id) {
    return this.equipments.find((eq) => eq.id === id);
  }
  add(equipment) {
    this.equipments.push(equipment);
  }
  deleteById(id) {
    this.equipments = this.equipments.filter((eq) => eq.id !== id);
  }
}
const equipments = new EquipmentList();

// routes
app.get("/equipments", (req, res) => {
  res.json(equipments.getList());
});

app.get("/equipments/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const equipment = equipments.getById(id);
  if (!equipment) {
    return res.status(404).json({ message: "equipment not found" });
  }

  res.json(equipments.getById(id));
});

app.post("/equipments", (req, res) => {
  const { name, room, status } = req.body;

  if (!name || !room || !status) {
    return res.status(400).json({ message: "Invalid equipment data" });
  }

  const equipment = new Equipment(name, room, status);

  equipments.add(equipment);

  res.status(201).json(equipment);
});

app.put("/equipments/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, room, status } = req.body;

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  if (!name || !room || !status) {
    return res.status(400).json({ message: "Invalid equipment data" });
  }

  const equipment = equipments.getById(id);

  if (!equipment) {
    return res.status(404).json({ message: "Equipment not found" });
  }

  equipment.update(name, room, status);

  res.json(equipment);
});

app.delete("/equipments/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const equipment = equipments.getById(id);

  if (!equipment) {
    return res.status(404).json({ message: "Equipment not found" });
  }

  equipments.deleteById(id);

  res.status(204).send();
});

app.listen(port, host, () => {
  console.log(`Server listens http://${host}:${port}`);
});
