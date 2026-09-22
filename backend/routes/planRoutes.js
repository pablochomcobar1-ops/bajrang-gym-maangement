const express = require("express");
const router = express.Router();
const {
  createPlan,
  getAllPlans,
  updatePlan,
  deletePlan,
} = require("../controllers/planController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, getAllPlans); // any logged-in user can view plans
router.post("/", protect, adminOnly, createPlan); // only admin can create
router.put("/:id", protect, adminOnly, updatePlan); // only admin can update
router.delete("/:id", protect, adminOnly, deletePlan); // only admin can delete

module.exports = router;
