import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { authorize } from "../middlewares/roleCheck.js";
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.controller.js";

const transactionRoutes = Router();

// Analyst and Admin can read

// /api/v1/transactions
transactionRoutes.get(
  "/",
  auth,
  authorize("Analyst", "Admin"),
  getTransactions,
);

// /api/v1/transactions/:id
transactionRoutes.get(
  "/:id",
  auth,
  authorize("Analyst", "Admin"),
  getTransactionById,
);

// Admin only for writes

// /api/v1/transactions
transactionRoutes.post("/", auth, authorize("Admin"), createTransaction);

// /api/v1/transactions/:id
transactionRoutes.put("/:id", auth, authorize("Admin"), updateTransaction);

// /api/v1/transactions/:id
transactionRoutes.delete("/:id", auth, authorize("Admin"), deleteTransaction);

export default transactionRoutes;
