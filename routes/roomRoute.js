import express from "express"
import { createRoom } from "../controllers/roomController.js";
import { verifyUser } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/roleMiddleWare.js";
import { PERMISSIONS } from "../config/permissions.js";

const router = express.Router();

router.post("/", verifyUser, verifyRole(...PERMISSIONS.rooms.create), createRoom)


export default router