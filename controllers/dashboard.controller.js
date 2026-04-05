import Transaction from "../models/Transaction.model.js";

// GET /api/v1/dashboard/summary — Viewer, Analyst, Admin
export const getSummary = async (req, res) => {
  const result = await Transaction.aggregate([
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    }
  ]);

  const income = result.find((r) => r._id === "income")?.total || 0;
  const expenses = result.find((r) => r._id === "expense")?.total || 0;

  return res.status(200).json({
    success: true,
    message: "Summary fetched successfully",
    data: {
      income,
      expenses,
      netBalance: income - expenses,
    },
  });
};

// GET /api/v1/dashboard/recent — Analyst, Admin
export const getRecentActivity = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const transactions = await Transaction.find()
    .sort({ date: -1 })
    .limit(limit)
    .populate("userId", "name email")
    .lean();

  return res.status(200).json({
    success: true,
    message: "Recent activity fetched successfully",
    count: transactions.length,
    data: transactions,
  });
};

// GET /api/v1/dashboard/categories — Analyst, Admin
export const getCategoryBreakdown = async (req, res) => {
  const result = await Transaction.aggregate([
    {
      $group: {
        _id: { category: "$category", type: "$type" },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id.category",
        type: "$_id.type",
        total: 1,
        count: 1,
      },
    },
    { $sort: { total: -1 } },
  ]);

  return res.status(200).json({
    success: true,
    message: "Category breakdown fetched successfully",
    count: result.length,
    data: result,
  });
};

// GET /api/v1/dashboard/trends — Analyst, Admin
export const getTrends = async (req, res) => {
  const result = await Transaction.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
        income: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
          },
        },
        expenses: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
          },
        },
        transactionCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        income: 1,
        expenses: 1,
        netBalance: { $subtract: ["$income", "$expenses"] },
        transactionCount: 1,
      },
    },
    { $sort: { month: -1 } },
  ]);

  return res.status(200).json({
    success: true,
    message: "Monthly trends fetched successfully",
    data: result,
  });
};
