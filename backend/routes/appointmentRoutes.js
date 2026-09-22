const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getMyAppointments,
  getMyRequests,
  updateStatus,
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createAppointment);
router.get("/mine", protect, getMyAppointments);
router.get("/requests", protect, getMyRequests);
router.put("/:id/status", protect, updateStatus);

module.exports = router;
