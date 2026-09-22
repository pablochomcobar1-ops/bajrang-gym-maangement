const express = require("express");
const router = express.Router();
const {
  getAllMembers,
  deleteMember,
  updateMember,
  getLeaderboard,
  assignMembership,
} = require("../controllers/userController");
const {
  protect,
  adminOnly,
  allowRoles,
} = require("../middleware/authMiddleware");

router.get("/leaderboard", protect, getLeaderboard);
router.get(
  "/",
  protect,
  allowRoles("admin", "trainer", "dietician"),
  getAllMembers,
);
router.put("/:id", protect, adminOnly, updateMember);
router.put("/:id/membership", protect, adminOnly, assignMembership);
router.delete("/:id", protect, adminOnly, deleteMember);

module.exports = router;
