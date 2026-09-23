const express = require("express");
const router = express.Router();
const {
  getAllAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, getAllAnnouncements);
router.post("/", protect, adminOnly, createAnnouncement);
router.delete("/:id", protect, adminOnly, deleteAnnouncement);

module.exports = router;
