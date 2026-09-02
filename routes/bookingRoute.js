import express from "express";
import { verifyUser } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/roleMiddleWare.js";
import { PERMISSIONS } from "../config/permissions.js";
import { createBooking } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", verifyUser, verifyRole(...PERMISSIONS.bookings.create), createBooking)
router.get("/getbooking/:id", verifyUser, verifyRole(...PERMISSIONS.bookings.viewOwn))


export default router