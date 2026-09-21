import express from "express";
import {
  createRoom,
  deleteRoom,
  getAllRoomsForAdmin,
  getAvailableRooms,
  getRoomById,
  updateRoom,
} from "../controllers/roomController.js";
import { verifyUser } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/roleMiddleWare.js";
import { PERMISSIONS } from "../config/permissions.js";

const router = express.Router();

router.post(
  "/",
  verifyUser,
  verifyRole(...PERMISSIONS.rooms.create),
  createRoom,
);
router.get("/", getAvailableRooms);
router.get(
  "/admin/all",
  verifyUser,
  verifyRole(...PERMISSIONS.rooms.viewAll),
  getAllRoomsForAdmin,
);
router.get("/:id", getRoomById);
router.put(
  "/:id",
  verifyUser,
  verifyRole(...PERMISSIONS.rooms.update),
  updateRoom,
);
router.delete(
  "/:id",
  verifyUser,
  verifyRole(...PERMISSIONS.rooms.delete),
  deleteRoom,
);

export default router;
