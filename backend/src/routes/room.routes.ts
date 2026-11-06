import express from "express";
import { roomController } from "../controllers/room.controller.js";

const roomRouter = express.Router();

roomRouter.get("/", (req, res) => {
  return roomController.getAll(req, res);
});

roomRouter.get("/:id", (req, res) => {
  return roomController.getById(req, res);
});

roomRouter.post("/", (req, res) => {
  return roomController.create(req, res);
});

roomRouter.put("/:id", (req, res) => {
  return roomController.update(req, res);
});

roomRouter.delete("/:id", (req, res) => {
  return roomController.delete(req, res);
});

export default roomRouter;
