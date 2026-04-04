import mongoose from "mongoose";

// create database connection
const dbconnect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ Database connection established");
  } catch (error) {
    console.error("❌ Connection issues with the database:", error.message);
    process.exit(1);
  }
};

export default dbconnect;
