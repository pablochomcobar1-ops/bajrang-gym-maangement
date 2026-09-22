const express = require("express");
const router = express.Router();
const {
  createGoal,
  getMyGoals,
  updateGoal,
} = require("../controllers/goalController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createGoal);
router.get("/me", protect, getMyGoals);
router.put("/:id", protect, updateGoal);

module.exports = router;
