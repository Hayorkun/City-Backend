import express from "express";
import { verifyUser } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/roleMiddleWare.js";
import { PERMISSIONS } from "../config/permissions.js";
import {
  cancelBooking,
  createBooking,
  getAllBookingForStaff,
  getBookingById,
  getUserBookings,
  updateBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post(
  "/",
  verifyUser,
  verifyRole(...PERMISSIONS.bookings.create),
  createBooking,
);
router.get(
  "/staff/all",
  verifyUser,
  verifyRole(...PERMISSIONS.bookings.viewAll),
  getAllBookingForStaff,
);
router.get(
  "/my-bookings",
  verifyUser,
  verifyRole(...PERMISSIONS.bookings.viewOwn),
  getUserBookings,
);
router.get(
  "/:id",
  verifyUser,
  verifyRole(...PERMISSIONS.bookings.viewOwn),
  getBookingById,
);
router.patch(
  "/:id",
  verifyUser,
  verifyRole(...PERMISSIONS.bookings.cancel),
  cancelBooking,
);
router.put(
  "/:id/status",
  verifyUser,
  verifyRole(...PERMISSIONS.bookings.update),
  updateBooking,
);


export default router;
