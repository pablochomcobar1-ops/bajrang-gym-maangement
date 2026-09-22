const express = require("express");
const router = express.Router();
const {
  createAssignedPlan,
  getPlansICreated,
  getMyPlans,
} = require("../controllers/assignedPlanController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  allowRoles("trainer", "dietician"),
  createAssignedPlan,
);
router.get(
  "/created-by-me",
  protect,
  allowRoles("trainer", "dietician"),
  getPlansICreated,
);
router.get("/my-plans", protect, getMyPlans); // any logged-in member can see their own plans

module.exports = router;
