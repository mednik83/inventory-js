import express from "express";
import { equipmentController } from "../controllers/equipment.controller.js";

const equipmentRouter = express.Router();

equipmentRouter.get("/", (req, res) => {
  equipmentController.getAll(req, res);
});

equipmentRouter.get("/:id", (req, res) => {
  equipmentController.getById(req, res);
});

equipmentRouter.get("/uuid/:uuid", (req, res) => {
  equipmentController.getByUuid(req, res);
});

equipmentRouter.post("/", (req, res) => {
  equipmentController.create(req, res);
});

equipmentRouter.put("/:id", (req, res) => {
  equipmentController.update(req, res);
});

equipmentRouter.post("/:id/write-off", (req, res) => {
  equipmentController.writeOff(req, res);
});

equipmentRouter.delete("/:id", (req, res) => {
  equipmentController.forceDelete(req, res);
});

// qr

equipmentRouter.get("/uuid/:uuid/qr", (req, res) => {
  equipmentController.getQrByUuid(req, res);
});

export default equipmentRouter;
