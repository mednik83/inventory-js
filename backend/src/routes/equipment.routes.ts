import express from "express";
import { equipmentController } from "../controllers/equipment.controller.js";

const equipmentRouter = express.Router();

equipmentRouter.get("/", (req, res, next) => {
  equipmentController.getAll(req, res, next);
});

equipmentRouter.get("/:id", (req, res, next) => {
  equipmentController.getById(req, res, next);
});

equipmentRouter.get("/uuid/:uuid", (req, res, next) => {
  equipmentController.getByUuid(req, res, next);
});

equipmentRouter.post("/", (req, res, next) => {
  equipmentController.create(req, res, next);
});

equipmentRouter.put("/:id", (req, res, next) => {
  equipmentController.update(req, res, next);
});

equipmentRouter.post("/:id/move", (req, res, next) => {
  equipmentController.move(req, res, next);
});

equipmentRouter.post("/:id/write-off", (req, res, next) => {
  equipmentController.writeOff(req, res, next);
});

equipmentRouter.delete("/:id", (req, res, next) => {
  equipmentController.forceDelete(req, res, next);
});

// qr

equipmentRouter.get("/uuid/:uuid/qr", (req, res, next) => {
  equipmentController.getQrByUuid(req, res, next);
});

export default equipmentRouter;
