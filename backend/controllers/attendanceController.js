const Attendance = require("../models/Attendance");

// @desc   Check in a member (admin/receptionist only)
// @route  POST /api/attendance
const checkInMember = async (req, res) => {
  try {
    const { member } = req.body;

    if (!member) {
      return res.status(400).json({ message: "Member is required" });
    }

    const record = await Attendance.create({
      member,
      checkedInBy: req.user._id,
    });

    const populated = await record.populate("member", "name email");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get today's check-ins (admin/receptionist only)
// @route  GET /api/attendance/today
const getTodayAttendance = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const records = await Attendance.find({ createdAt: { $gte: startOfToday } })
      .populate("member", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { checkInMember, getTodayAttendance };
