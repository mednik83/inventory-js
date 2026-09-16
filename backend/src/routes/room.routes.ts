import express from "express";
import { roomController } from "../controllers/room.controller.js";

const roomRouter = express.Router();

roomRouter.get("/", (req, res, next) => {
  roomController.getAll(req, res, next);
});

roomRouter.get("/:id", (req, res, next) => {
  roomController.getById(req, res, next);
});

roomRouter.post("/", (req, res, next) => {
  roomController.create(req, res, next);
});

roomRouter.put("/:id", (req, res, next) => {
  roomController.update(req, res, next);
});

roomRouter.delete("/:id", (req, res, next) => {
  roomController.delete(req, res, next);
});

export default roomRouter;
