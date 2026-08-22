import express from "express";
import { login, registerUser, getUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login)
router.get("/me", getUser)

export default router;
