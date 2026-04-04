import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      required: true,
      enum: ["User", "Admin"],
      default: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
