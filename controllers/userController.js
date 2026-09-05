import User from "../models/User.js";

export const updateUserRole = async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (targetUser._id.toString() === req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Request rejected",
      });
    }
    if (!["customer", "staff", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role type",
      });
    }

    const touchesAdminTier = role === "admin" || targetUser.role === "admin";
   if (touchesAdminTier && req.user.isOwner !== true) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    if (targetUser.role === role) {
      return res.status(400).json({
        success: false,
        message: "User already has this role",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, select: "-password" },
    );

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
