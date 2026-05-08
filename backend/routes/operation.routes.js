import express from "express";
import { operationController } from "../controllers/operation.controller.js";

const operationRouter = express.Router();

operationRouter.get("/", (req, res) => {
  operationController.getByEquipmentId(req, res);
});

export default operationRouter;
