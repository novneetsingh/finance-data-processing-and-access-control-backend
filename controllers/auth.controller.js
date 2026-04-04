import User from "../models/User.model.js";
import ErrorResponse from "../utils/errorResponse.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// register a new user
export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    throw new ErrorResponse("All fields are required", 400);

  // Check if user already exists
  const existingUser = await User.exists({ email });

  if (existingUser)
    throw new ErrorResponse(
      "User already exists. Please Login to continue.",
      400,
    );

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the user (accountType defaults to "Viewer")
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  user.password = undefined;

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
};

// login a user
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new ErrorResponse("All fields are required", 400);

  const user = await User.findOne({ email }).lean();

  // If user not found with provided email
  if (!user)
    throw new ErrorResponse(
      "User is not Registered with Us. Please SignUp to Continue",
      400,
    );

  // Check if account is active
  if (!user.isActive)
    throw new ErrorResponse("Your account has been deactivated", 403);

  // verify password
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) throw new ErrorResponse("Incorrect Password", 400);

  // generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  user.password = undefined;

  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: {
      user,
      token,
    },
  });
};
