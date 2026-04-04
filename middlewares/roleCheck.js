import ErrorResponse from "../utils/errorResponse.js";

// Higher-order middleware factory for role-based access control
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) throw new ErrorResponse("Not authenticated", 401);

    if (!roles.includes(req.user.accountType))
      throw new ErrorResponse(
        `Role '${req.user.accountType}' is not authorized to access this route`,
        403,
      );

    next();
  };
};
