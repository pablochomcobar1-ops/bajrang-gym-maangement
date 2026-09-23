const express = require("express");
const router = express.Router();
const {
  checkInMember,
  getTodayAttendance,
  getMyAttendance,
} = require("../controllers/attendanceController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

router.post("/", protect, allowRoles("admin", "receptionist"), checkInMember);
router.get(
  "/today",
  protect,
  allowRoles("admin", "receptionist"),
  getTodayAttendance,
);

router.get("/mine", protect, getMyAttendance);
module.exports = router;
