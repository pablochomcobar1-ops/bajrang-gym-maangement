const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/analyticsController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

console.log("analyticsRoutes.js loaded successfully");
router.get("/dashboard", protect, adminOnly, getDashboardStats);

module.exports = router;
