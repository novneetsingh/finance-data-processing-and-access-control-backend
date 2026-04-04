import express from "express";
import "dotenv/config";
import dbconnect from "./config/database.js";
import mainRoutes from "./routes/main.routes.js";

const app = express();

app.use(express.json());

// database connection
dbconnect();

app.get("/", (req, res) => {
  res.send("Finance Data Processing and Access Control Backend");
});

app.use("/api/v1", mainRoutes);

// global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
