import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/errorResponse.js";
import User from "../models/User.model.js";

// Auth middleware
export const auth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) throw new ErrorResponse("Token missing", 401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password").lean();

    if (!user) throw new ErrorResponse("User not found", 401);
    if (!user.isActive) throw new ErrorResponse("Account is deactivated", 403);

    // Attach full user object so controllers can use req.user._id and req.user.accountType
    req.user = user;

    next();
  } catch (err) {
    if (err.statusCode) throw err;
    throw new ErrorResponse("Invalid or expired token", 401);
  }
};
