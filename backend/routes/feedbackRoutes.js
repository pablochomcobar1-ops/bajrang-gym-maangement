const express = require("express");
const router = express.Router();
const {
  createFeedback,
  getAllFeedback,
  getFeedbackSummary,
} = require("../controllers/feedbackController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, createFeedback);
router.get("/", protect, adminOnly, getAllFeedback);
router.get("/summary", protect, adminOnly, getFeedbackSummary);

module.exports = router;
