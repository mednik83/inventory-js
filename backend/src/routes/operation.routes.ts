import express from "express";
import { operationController } from "../controllers/operation.controller.js";

const operationRouter = express.Router();

operationRouter.get("/", (req, res, next) => {
  operationController.getByEquipmentId(req, res, next);
});

export default operationRouter;
