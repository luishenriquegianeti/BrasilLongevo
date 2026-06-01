import express from "express";
import {
  addControle,
  deleteControle,
  getControles,
  searchControles,
  updateControle,
} from "../controllers/controle.js";

const router = express.Router();

router.get("/", getControles);
router.get("/search/:term", searchControles);
router.post("/", addControle);
router.put("/:id", updateControle);
router.delete("/:id", deleteControle);

export default router;
