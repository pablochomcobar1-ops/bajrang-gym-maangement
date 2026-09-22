const AssignedPlan = require("../models/AssignedPlan");

// @desc   Create a plan for a member (trainer/dietician only)
// @route  POST /api/assigned-plans
const createAssignedPlan = async (req, res) => {
  try {
    const { member, type, title, details } = req.body;

    const plan = await AssignedPlan.create({
      member,
      assignedBy: req.user._id,
      type,
      title,
      details,
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get plans created by the logged-in trainer/dietician
// @route  GET /api/assigned-plans/created-by-me
const getPlansICreated = async (req, res) => {
  try {
    const plans = await AssignedPlan.find({ assignedBy: req.user._id })
      .populate("member", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get plans assigned to the logged-in member
// @route  GET /api/assigned-plans/my-plans
const getMyPlans = async (req, res) => {
  try {
    const plans = await AssignedPlan.find({ member: req.user._id })
      .populate("assignedBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createAssignedPlan, getPlansICreated, getMyPlans };
