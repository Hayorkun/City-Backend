import { now } from "mongoose";
import Booking from "../models/booking.js";
import Room from "../models/room.js";

export const createBooking = async (req, res, next) => {
  const { room, checkIn, checkOut, guests } = req.body;

  try {
    if (!room || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        message: "Room, guests, check in and check out date are required.",
      });
    }
    const requestedCheckIn = new Date(checkIn);
    const requestedCheckOut = new Date(checkOut);
    requestedCheckIn.setHours(12, 0, 0, 0);
    requestedCheckOut.setHours(12, 0, 0, 0);
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    if (
      isNaN(requestedCheckIn.getTime()) ||
      isNaN(requestedCheckOut.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    if (requestedCheckOut <= requestedCheckIn) {
      return res.status(400).json({
        success: false,
        message: "Invalid date.",
      });
    }
    if (requestedCheckIn < today) {
      return res.status(400).json({
        success: false,
        message: "Invalid date.",
      });
    }

    const roomExist = await Room.findById(room);
    if (!roomExist) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }
    if (["maintenance", "inactive"].includes(roomExist.status)) {
      return res.status(409).json({
        success: false,
        message: "Room not available for booking",
      });
    }
    if (guests > roomExist.capacity || guests < 1) {
      return res.status(400).json({
        success: false,
        message: "Guest exceeds room capacity",
      });
    }

    const bookingExist = await Booking.findOne({
      room: room,
      status: { $in: ["pending", "confirmed", "checkedIn"] },
      checkIn: {
        $lt: requestedCheckOut,
      },
      checkOut: {
        $gt: requestedCheckIn,
      },
    });
    if (bookingExist) {
      return res.status(409).json({
        success: false,
        message: "Room not available for booking",
      });
    }
    const duration = requestedCheckOut - requestedCheckIn;
    const nights = duration / 86400000;
    const pricePerNight = roomExist.price;
    const totalPrice = pricePerNight * nights;

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const booking = await Booking.create({
      user: req.user.id,
      room: roomExist._id,
      checkIn: requestedCheckIn,
      checkOut: requestedCheckOut,
      guests,
      pricePerNight,
      totalPrice,
      expiresAt,
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const getBooking = await Booking.findById(id);

    if (!getBooking) {
      return res.status(404).json({
        success: false,
        message: "No booking found",
      });
    }
    if (req.user.role === "customer") {
      if (getBooking.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Access denied: user not authorized",
        });
      }
    }
    return res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data: getBooking,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const getBooking = await Booking.find({ user: req.user.id });

    return res.status(200).json({
      success: true,
      message: "Booking retrived successfully",
      data: getBooking,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBookingForStaff = async (req, res, next) => {
  try {
    const allBooking = await Booking.find();

    return res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: allBooking,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  const { id } = req.params;
  try {
    const fetchBooking = await Booking.findById(id);
    if (!fetchBooking) {
      return res.status(404).json({
        success: false,
        message: "No booking found",
      });
    }
    if (req.user.role === "customer") {
      if (fetchBooking.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
    }
    if (
      fetchBooking.status === "checkedIn" ||
      fetchBooking.status === "checkedOut" ||
      fetchBooking.status === "cancelled"
    ) {
      return res.status(409).json({
        success: false,
        message: "Change denied",
      });
    }
    const now = new Date();
    const cancel = await Booking.findByIdAndUpdate(
      id,
      { status: "cancelled", cancelledAt: now },
      { new: true },
    );
    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: cancel,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBooking = async (req, res, next) => {
  const ALLOWED_TRANSITIONS = {
    pending: "confirmed",
    confirmed: "checkedIn",
    checkedIn: "checkedOut",
  };
  const { status } = req.body;
  const { id } = req.params;
  try {
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "No booking found",
      });
    }
    if (
      ![
        "pending",
        "confirmed",
        "checkedIn",
        "checkedOut",
        "cancelled",
      ].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Malformed status",
      });
    }
    const nextStatus = ALLOWED_TRANSITIONS[booking.status];
    if (nextStatus !== status) {
      return res.status(409).json({
        success: false,
        message: "Cannot change booking status",
      });
    }
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};
