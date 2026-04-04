import User from "../models/User.model.js";
import ErrorResponse from "../utils/errorResponse.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// register a new user
export const signUp = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
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

  // Create the user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    accountType: req.body.accountType,
  });

  return res.status(201).json({
    success: user ? true : false,
    message: user ? "User registered successfully" : "User registration failed",
    data: user ? user : null,
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

  // verify password
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) throw new ErrorResponse("Incorrect Password", 400);

  // generate JWT token
  const token = jwt.sign(
    { id: user._id, accountType: user.accountType },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  user.password = undefined;

  return res.status(200).json({
    success: user ? true : false,
    message: user ? "User logged in successfully" : "User login failed",
    data: user
      ? {
          user,
          token,
        }
      : null,
  });
};
