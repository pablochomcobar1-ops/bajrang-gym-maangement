const ProgressLog = require("../models/ProgressLog");

// @desc   Log a new progress entry (member only, for themselves)
// @route  POST /api/progress
const createLog = async (req, res) => {
  try {
    const { weight, bodyFatPercent, notes } = req.body;

    const log = await ProgressLog.create({
      member: req.user._id,
      weight,
      bodyFatPercent,
      notes,
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get the logged-in member's own progress history
// @route  GET /api/progress/me
const getMyLogs = async (req, res) => {
  try {
    const logs = await ProgressLog.find({ member: req.user._id }).sort({
      createdAt: 1,
    });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get a specific member's progress (trainer/dietician/admin)
// @route  GET /api/progress/member/:id
const getMemberLogs = async (req, res) => {
  try {
    const logs = await ProgressLog.find({ member: req.params.id }).sort({
      createdAt: 1,
    });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createLog, getMyLogs, getMemberLogs };
