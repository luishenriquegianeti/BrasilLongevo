import express from "express";
import { getUsers } from "../controllers/user.js";

const router = express.Router();
// comandos para banco de dados 

router.get("/", getUsers);

export default router