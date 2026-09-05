import express from "express";
import { updateUserRole } from "../controllers/userController.js";
import { verifyUser } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/roleMiddleWare.js";
import { PERMISSIONS } from "../config/permissions.js";

const router = express.Router();

router.patch(
  "/:id",
  verifyUser,
  verifyRole(...PERMISSIONS.users.update),
  updateUserRole,
);

export default router;
