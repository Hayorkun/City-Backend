import axios from "axios";

export const initializePaystackPayment = async ({ email, amount }) => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const callbackUrl = process.env.PAYSTACK_CALLBACK_URL;

  if (!secretKey || !callbackUrl) {
    throw new Error("Paystack environment variables are not configured");
  }

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        callback_url: callbackUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.data;
  } catch (error) {
    console.error(
      "Paystack initialization failed:",
      error.response?.data || error.message,
    );

    throw new Error("Unable to initialize payment with Paystack");
  }
};

export const verifyPaystackPayment = async (reference) => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      },
    );

    return response.data.data;
  } catch (error) {
    console.error(
      "Paystack verification failed:",
      error.response?.data || error.message,
    );

    throw new Error("Unable to verify payment with Paystack");
  }
};
