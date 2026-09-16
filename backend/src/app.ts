import express from "express";
import cors from "cors";

import equipmentRoutes from "./routes/equipment.routes.js";
import roomRoutes from "./routes/room.routes.js";
import operationRoutes from "./routes/operation.routes.js";
import { errorHandler } from "./middlewares/error-handler.js";

export const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/equipments", equipmentRoutes);
app.use("/rooms", roomRoutes);
app.use("/operations", operationRoutes);

app.use(errorHandler);
