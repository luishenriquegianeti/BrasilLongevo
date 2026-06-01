import express from "express";

import cors from "cors";

import userRoutes from "./routes/users.js";

import controleRoutes from "./routes/controle.js";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/", userRoutes);

app.use("/controle", controleRoutes);

app.listen(8800);
