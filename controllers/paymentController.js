import Booking from "../models/booking.js";
import Payment from "../models/payment.js";
import {
  initializePaystackPayment,
  verifyPaystackPayment,
} from "../services/paystackExternalApi.js";

export const initiatePayment = async (req, res, next) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id).populate("user");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "No booking found",
      });
    }

    if (booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Request denied",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Booking status invalid",
      });
    }

    const existingPayment = await Payment.findOne({
      booking: booking._id,
    });

    if (existingPayment?.status === "success") {
      return res.status(400).json({
        success: false,
        message: "Booking has already been paid for",
      });
    }

    const paystackData = await initializePaystackPayment({
      email: booking.user.email,
      amount: booking.totalPrice,
    });

    if (existingPayment) {
      existingPayment.reference = paystackData.reference;
      existingPayment.amount = booking.totalPrice;
      existingPayment.status = "pending";
      existingPayment.paystackData = paystackData;
      existingPayment.paidAt = undefined;

      await existingPayment.save();
    } else {
      await Payment.create({
        booking: booking._id,
        reference: paystackData.reference,
        amount: booking.totalPrice,
        status: "pending",
        paystackData,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment initialized successfully",
      data: {
        authorization_url: paystackData.authorization_url,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const paymentCallback = async (req, res, next) => {
  try {
    const { reference, trxref } = req.query;

    const paymentReference = reference || trxref;

    if (!paymentReference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required",
      });
    }

    const paystackData = await verifyPaystackPayment(paymentReference);

    const payment = await Payment.findOne({
      reference: paymentReference,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    if (paystackData.amount !== payment.amount * 100) {
      return res.status(400).json({
        success: false,
        message: "Payment amount mismatch",
      });
    }

    const booking = await Booking.findById(payment.booking);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Associated booking not found",
      });
    }

    if (paystackData.status === "success") {
      // Only a pending booking can become confirmed
      if (booking.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "Booking is no longer pending",
        });
      }

      payment.status = "success";
      payment.paidAt = new Date();
      payment.paystackData = paystackData;

      await payment.save();

      booking.status = "confirmed";

      await booking.save();

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: {
          reference: payment.reference,
          paymentStatus: payment.status,
          bookingStatus: booking.status,
        },
      });
    }
    if (
      paystackData.status === "failed" ||
      paystackData.status === "abandoned"
    ) {
      payment.status = "failed";
      payment.paystackData = paystackData;

      await payment.save();

      return res.status(200).json({
        success: false,
        message: "Payment was not successful",
        data: {
          reference: payment.reference,
          paymentStatus: payment.status,
          bookingStatus: booking.status,
        },
      });
    }

    payment.status = "pending";
    payment.paystackData = paystackData;

    await payment.save();

    return res.status(200).json({
      success: false,
      message: "Payment is still being processed",
      data: {
        reference: payment.reference,
        paymentStatus: payment.status,
        bookingStatus: booking.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
