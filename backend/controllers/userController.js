const User = require("../models/user");
const MembershipPlan = require("../models/MembershipPlan");

// @desc   Get all members (admin only)
// @route  GET /api/users
const getAllMembers = async (req, res) => {
  try {
    const members = await User.find({ role: "member" })
      .select("-password")
      .populate("membershipPlan", "name price durationInMonths");
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Delete a member (admin only)
// @route  DELETE /api/users/:id
const deleteMember = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Update a member's details (admin only)
// @route  PUT /api/users/:id
const updateMember = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only update fields that were actually provided
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const topMembers = await User.find({ role: "member" })
      .select("name points")
      .sort({ points: -1 })
      .limit(10);

    res.status(200).json(topMembers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Assign or renew a member's plan (admin only)
// @route  PUT /api/users/:id/membership
const assignMembership = async (req, res) => {
  try {
    const { planId } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const plan = await MembershipPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Calculate expiry: today + plan's duration in months
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + plan.durationInMonths);

    user.membershipPlan = plan._id;
    user.membershipExpiry = expiryDate;

    await user.save();

    const updatedUser = await User.findById(user._id)
      .select("-password")
      .populate("membershipPlan", "name price durationInMonths");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllMembers,
  deleteMember,
  updateMember,
  getLeaderboard,
  assignMembership,
}; // UPDATE this line
