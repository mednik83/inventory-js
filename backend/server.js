"use strict";

import express from "express";
import cors from "cors";

import equipmentRoutes from "./route.js";

// init server
const app = express();

app.use(cors());
app.use(express.json());

// router
app.use("/equipments", equipmentRoutes);

const host = "localhost";
const port = 8010;

// start server
app.listen(port, host, () => {
  console.log(`Server listens http://${host}:${port}`);
});
