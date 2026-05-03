import express from "express";
import { equipmentController } from "../controllers/controller.js";

const router = express.Router();

router.get("/", (req, res) => {
  equipmentController.getAll(req, res);
});

router.get("/:id", (req, res) => {
  equipmentController.getById(req, res);
});

router.post("/", (req, res) => {
  equipmentController.create(req, res);
});

router.put("/:id", (req, res) => {
  equipmentController.update(req, res);
});

router.delete("/:id", (req, res) => {
  equipmentController.remove(req, res);
});

export default router;
