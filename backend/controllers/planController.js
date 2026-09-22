const MembershipPlan = require("../models/MembershipPlan");

// @desc   Create a new membership plan (admin only)
// @route  POST /api/plans
const createPlan = async (req, res) => {
  try {
    const { name, durationInMonths, price, description } = req.body;

    const plan = await MembershipPlan.create({
      name,
      durationInMonths,
      price,
      description,
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get all membership plans (any logged-in user)
// @route  GET /api/plans
const getAllPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Update a plan (admin only)
// @route  PUT /api/plans/:id
const updatePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const { name, durationInMonths, price, description } = req.body;

    plan.name = name || plan.name;
    plan.durationInMonths = durationInMonths || plan.durationInMonths;
    plan.price = price ?? plan.price; // allows setting price to 0 if needed
    plan.description = description ?? plan.description;

    const updatedPlan = await plan.save();
    res.status(200).json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Delete a plan (admin only)
// @route  DELETE /api/plans/:id
const deletePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    await plan.deleteOne();
    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createPlan, getAllPlans, updatePlan, deletePlan };
