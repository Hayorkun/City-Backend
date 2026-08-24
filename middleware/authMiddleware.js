import User from "../models/User.js";
import { verifyToken } from "../utils/tokenManager.js";

export const verifyUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token); //TOKEN EXTRACTED
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.error("Auth failed: user not found for id", decoded.id);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session, please try again",
      });
    }
    if (user.isActive === false) {
      console.error("Auth failed: account deactivated for", user._id);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session, please try again",
      });
    }
    if (decoded.tokenVersion !== user.tokenVersion) {
      console.error("Auth failed: stale token version for", user._id);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session, please try again",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth failed:", error.name, error.message)
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session, please try again"
    });
  }
};
