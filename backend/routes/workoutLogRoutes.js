const express = require("express");
const router = express.Router();
const {
  createWorkoutLog,
  getMuscleSummary,
} = require("../controllers/workoutLogController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createWorkoutLog);
router.get("/muscle-summary", protect, getMuscleSummary);

module.exports = router;
