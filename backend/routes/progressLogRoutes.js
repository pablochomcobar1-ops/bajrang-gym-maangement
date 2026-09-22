const express = require("express");
const router = express.Router();
const {
  createLog,
  getMyLogs,
  getMemberLogs,
} = require("../controllers/progressLogController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

router.post("/", protect, createLog);
router.get("/me", protect, getMyLogs);
router.get(
  "/member/:id",
  protect,
  allowRoles("admin", "trainer", "dietician"),
  getMemberLogs,
);

module.exports = router;
