import Transaction from "../models/Transaction.model.js";
import ErrorResponse from "../utils/errorResponse.js";

// POST /api/v1/transactions — Admin only
export const createTransaction = async (req, res) => {
  const { amount, type, category, notes } = req.body;

  if (!amount && amount !== 0)
    throw new ErrorResponse("amount is required", 400);
  if (!type) throw new ErrorResponse("type is required", 400);
  if (!category) throw new ErrorResponse("category is required", 400);

  if (!["income", "expense"].includes(type))
    throw new ErrorResponse("type must be 'income' or 'expense'", 400);

  if (typeof amount !== "number" || amount < 0)
    throw new ErrorResponse("amount must be a non-negative number", 400);

  const transaction = await Transaction.create({
    amount,
    type,
    category,
    notes,
    userId: req.user._id,
  });

  return res.status(201).json({
    success: true,
    message: "Transaction created successfully",
    data: transaction,
  });
};

// GET /api/v1/transactions — Analyst, Admin
export const getTransactions = async (req, res) => {
  const { type, category, startDate, endDate } = req.query;

  const filter = {};

  if (type) {
    if (!["income", "expense"].includes(type))
      throw new ErrorResponse("type must be 'income' or 'expense'", 400);
    filter.type = type;
  }

  if (category) filter.category = new RegExp(category.trim(), "i");

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) {
      // set end date to end of the day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.date.$lte = end;
    }
  }

  const transactions = await Transaction.find(filter).sort({ date: -1 }).lean();

  return res.status(200).json({
    success: true,
    message: "Transactions fetched successfully",
    count: transactions.length,
    data: transactions,
  });
};

// GET /api/v1/transactions/:id — Analyst, Admin
export const getTransactionById = async (req, res) => {
  const transaction = await Transaction.findById(req.params.id).lean();

  if (!transaction) throw new ErrorResponse("Transaction not found", 404);

  return res.status(200).json({
    success: true,
    message: "Transaction fetched successfully",
    data: transaction,
  });
};

// PUT /api/v1/transactions/:id — Admin only
export const updateTransaction = async (req, res) => {
  const { amount, type, category, notes } = req.body;

  if (type && !["income", "expense"].includes(type))
    throw new ErrorResponse("type must be 'income' or 'expense'", 400);

  if (amount !== undefined && (typeof amount !== "number" || amount < 0))
    throw new ErrorResponse("amount must be a non-negative number", 400);

  const updates = {};
  if (amount !== undefined) updates.amount = amount;
  if (type) updates.type = type;
  if (category) updates.category = category;
  if (notes !== undefined) updates.notes = notes;

  const transaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true },
  ).lean();

  if (!transaction) throw new ErrorResponse("Transaction not found", 404);

  return res.status(200).json({
    success: true,
    message: "Transaction updated successfully",
    data: transaction,
  });
};

// DELETE /api/v1/transactions/:id — Admin only
export const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findByIdAndDelete(req.params.id).lean();

  if (!transaction) throw new ErrorResponse("Transaction not found", 404);

  return res.status(200).json({
    success: true,
    message: "Transaction deleted successfully",
    data: transaction,
  });
};
