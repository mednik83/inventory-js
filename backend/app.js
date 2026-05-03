import express from "express";
import cors from "cors";

import equipmentRoutes from "./routes/route.js";

export const app = express();

app.use(cors());
app.use(express.json());

// router
app.use("/equipments", equipmentRoutes);
