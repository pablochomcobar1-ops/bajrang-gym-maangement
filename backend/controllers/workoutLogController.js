const WorkoutLog = require("../models/WorkoutLog");

// @desc   Log a workout (member only, for themselves)
// @route  POST /api/workout-logs
const createWorkoutLog = async (req, res) => {
  try {
    const { muscleGroups, notes } = req.body;

    const log = await WorkoutLog.create({
      member: req.user._id,
      muscleGroups,
      notes,
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get muscle group training frequency for the last 30 days
// @route  GET /api/workout-logs/muscle-summary
const getMuscleSummary = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const summary = await WorkoutLog.aggregate([
      {
        $match: {
          member: req.user._id,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      { $unwind: "$muscleGroups" },
      {
        $group: {
          _id: "$muscleGroups",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createWorkoutLog, getMuscleSummary };
