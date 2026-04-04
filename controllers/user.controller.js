import User from "../models/User.model.js";
import ErrorResponse from "../utils/errorResponse.js";

const VALID_ROLES = ["Viewer", "Analyst", "Admin"];

// GET /api/v1/users — Admin only
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").lean();

  return res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: users,
  });
};

// PATCH /api/v1/users/:id/role — Admin only
export const updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!role) throw new ErrorResponse("Role is required", 400);

  if (!VALID_ROLES.includes(role))
    throw new ErrorResponse(
      `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`,
      400,
    );

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { accountType: role },
    { new: true },
  )
    .select("-password")
    .lean();

  if (!user) throw new ErrorResponse("User not found", 404);

  return res.status(200).json({
    success: true,
    message: "User role updated successfully",
    data: user,
  });
};

// PATCH /api/v1/users/:id/status — Admin only
export const updateUserStatus = async (req, res) => {
  const { isActive } = req.body;

  if (typeof isActive !== "boolean")
    throw new ErrorResponse("isActive must be a boolean", 400);

  // Prevent admin from deactivating themselves
  if (req.params.id === req.user._id.toString())
    throw new ErrorResponse("You cannot change your own status", 400);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive },
    { new: true },
  )
    .select("-password")
    .lean();

  if (!user) throw new ErrorResponse("User not found", 404);

  return res.status(200).json({
    success: true,
    message: `User ${isActive ? "activated" : "deactivated"} successfully`,
    data: user,
  });
};
