import express from "express";
import { addUser, deleteUser, getUsers, searchUsers, updateUser } from "../controllers/user.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/search/:term", searchUsers);
router.post("/", addUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
