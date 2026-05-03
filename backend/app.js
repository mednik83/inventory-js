import express from "express";
import cors from "cors";

import equipmentRoutes from "./routes/equipment.routes.js";
import roomRoutes from "./routes/room.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/equipments", equipmentRoutes);
app.use("/rooms", roomRoutes);
