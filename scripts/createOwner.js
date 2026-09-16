import User from "../models/User.js";
import connectDB from "../config/DB.js";
import { hashPassword } from "../utils/passwordManager.js";
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const createOwner = async () => {
  try {
    await connectDB();
    const userExists = await User.findOne({
      isOwner: true,
    });
    if (userExists) {
      console.log("Owner already exists. No new owner created");
      return;
    }
    const { OWNER_EMAIL, OWNER_PASSWORD, OWNER_FIRST_NAME, OWNER_LAST_NAME } =
      process.env;

    if (
      !OWNER_EMAIL ||
      !OWNER_PASSWORD ||
      !OWNER_FIRST_NAME ||
      !OWNER_LAST_NAME
    ) {
      throw new Error("Owner environment variables are missing");
    }
    const emailExists = await User.findOne({ email: OWNER_EMAIL })
    if (emailExists) {
      throw new Error("User email is already been used");
    }
    const hashedPassword = await hashPassword(OWNER_PASSWORD);
    const owner = await User.create({
      email: OWNER_EMAIL,
      firstName: OWNER_FIRST_NAME,
      lastName: OWNER_LAST_NAME,
      password: hashedPassword,
      role: "admin",
      isOwner: true,
    });
    console.log(`Owner created successfully: ${owner.email}`);
  } catch (error) {
    console.error("Failed to create owner:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createOwner();
