import express from "express";
import { equipmentController } from "../controllers/equipment.controller.js";

const equipmentRouter = express.Router();

equipmentRouter.get("/", (req, res) => {
  return equipmentController.getAll(req, res);
});

equipmentRouter.get("/:id", (req, res) => {
  return equipmentController.getById(req, res);
});

equipmentRouter.get("/uuid/:uuid", (req, res) => {
  return equipmentController.getByUuid(req, res);
});

equipmentRouter.post("/", (req, res) => {
  return equipmentController.create(req, res);
});

equipmentRouter.put("/:id", (req, res) => {
  return equipmentController.update(req, res);
});

equipmentRouter.post("/:id/move", (req, res) => {
  return equipmentController.move(req, res);
});

equipmentRouter.post("/:id/write-off", (req, res) => {
  return equipmentController.writeOff(req, res);
});

equipmentRouter.delete("/:id", (req, res) => {
  return equipmentController.forceDelete(req, res);
});

// qr

equipmentRouter.get("/uuid/:uuid/qr", (req, res, next) => {
  return equipmentController.getQrByUuid(req, res, next);
});

export default equipmentRouter;
