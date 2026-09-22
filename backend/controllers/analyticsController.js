const User = require("../models/user");
const MembershipPlan = require("../models/MembershipPlan");
const Attendance = require("../models/Attendance");
// @desc   Get dashboard summary stats (admin only)
// @route  GET /api/analytics/dashboard
const getDashboardStats = async (req, res) => {
  try {
    // Simple counts
    const totalMembers = await User.countDocuments({ role: "member" });
    const totalPlans = await MembershipPlan.countDocuments();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayCheckIns = await Attendance.countDocuments({
      createdAt: { $gte: startOfToday },
    });

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const expiringSoonCount = await User.countDocuments({
      role: "member",
      membershipExpiry: { $gte: new Date(), $lte: sevenDaysFromNow },
    });

    const revenueResult = await User.aggregate([
      {
        $match: {
          role: "member",
          membershipExpiry: { $gte: new Date() },
        },
      },
      {
        $lookup: {
          from: "membershipplans",
          localField: "membershipPlan",
          foreignField: "_id",
          as: "plan",
        },
      },
      { $unwind: "$plan" },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$plan.price" },
          activeMemberships: { $sum: 1 },
        },
      },
    ]);

    const revenue = revenueResult[0] || {
      totalRevenue: 0,
      activeMemberships: 0,
    };

    // Members joined per month, for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const membersPerMonth = await User.aggregate([
      {
        $match: {
          role: "member",
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    res.status(200).json({
      totalMembers,
      totalPlans,
      todayCheckIns,
      expiringSoonCount,
      totalRevenue: revenue.totalRevenue,
      activeMemberships: revenue.activeMemberships,
      membersPerMonth,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getDashboardStats };
