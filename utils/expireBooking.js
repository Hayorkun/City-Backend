import cron from "node-cron";
import Booking from "../models/booking.js";

export const startBookingExpiryJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const result = await Booking.updateMany(
        {
          status: "pending",
          expiresAt: { $lt: now },
        },
        {
          status: "cancelled",
          cancelledAt: now,
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`Expired ${result.modifiedCount} pending booking(s)`);
      }
    } catch (error) {
      console.error("Booking expiry job failed:", error);
    }
  });
};