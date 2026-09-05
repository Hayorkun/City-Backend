import express from "express";
import { login, registerUser, getUser } from "../controllers/authController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login)
router.get("/user", verifyUser, getUser)

export default router;
