const Feedback = require("../models/Feedback");

// @desc   Submit feedback (member only)
// @route  POST /api/feedback
const createFeedback = async (req, res) => {
  try {
    const { category, rating, comment } = req.body;

    const feedback = await Feedback.create({
      member: req.user._id,
      category,
      rating,
      comment,
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get all feedback (admin only)
// @route  GET /api/feedback
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("member", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get average rating + total count (admin only)
// @route  GET /api/feedback/summary
const getFeedbackSummary = async (req, res) => {
  try {
    const result = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalFeedback: { $sum: 1 },
        },
      },
    ]);

    const summary = result[0] || { averageRating: 0, totalFeedback: 0 };
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createFeedback, getAllFeedback, getFeedbackSummary };
