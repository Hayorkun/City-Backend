import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/passwordManager.js";
import { generateToken } from "../utils/tokenManager.js";

export const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
      });
    }
    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: "customer",
    });

    const token = await generateToken(user._id, user.tokenVersion);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        token,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = await generateToken(user._id, user.tokenVersion);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        id: user._id,
        name: user.firstName + " " + user.lastName,
        token,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};
