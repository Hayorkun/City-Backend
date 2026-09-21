import express from "express";
import {
  initiatePayment,
  paymentCallback,
  recordManualPayment,
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
router.post(
  "/manual/:id",
  verifyUser,
  verifyRole(...PERMISSIONS.payments.recordManual),
  recordManualPayment,
);
router.get("/callback", paymentCallback);

export default router;
