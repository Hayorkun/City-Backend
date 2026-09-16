import express from "express";
import {
  initiatePayment,
  paymentCallback,
} from "../controllers/paymentController.js";
import { verifyUser } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/roleMiddleWare.js";
import { PERMISSIONS } from "../config/permissions.js";

const router = express.Router();

router.post(
  "/:id",
  verifyUser,
  verifyRole(...PERMISSIONS.payments.pay),
  initiatePayment,
);

router.get("/callback",verifyUser, paymentCallback);

export default router;
