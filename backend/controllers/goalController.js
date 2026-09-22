const Goal = require("../models/Goal");

// @desc   Create a new goal (member only, for themselves)
// @route  POST /api/goals
const createGoal = async (req, res) => {
  try {
    const { title, targetValue, unit, deadline } = req.body;

    const goal = await Goal.create({
      member: req.user._id,
      title,
      targetValue,
      unit,
      deadline,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get the logged-in member's own goals
// @route  GET /api/goals/me
const getMyGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ member: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Update progress on a goal (member only, their own)
// @route  PUT /api/goals/:id
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Only the goal's owner can update it
    if (goal.member.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this goal" });
    }

    const { currentValue } = req.body;
    goal.currentValue = currentValue ?? goal.currentValue;

    // Automatically mark complete if target reached
    if (goal.currentValue >= goal.targetValue) {
      goal.completed = true;
    }

    const updatedGoal = await goal.save();
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createGoal, getMyGoals, updateGoal };
