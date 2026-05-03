import express from "express";
import { roomController } from "../controllers/room.controller.js";

const roomRouter = express.Router();

roomRouter.get("/", (req, res) => {
  roomController.getAll(req, res);
});

export default roomRouter;
