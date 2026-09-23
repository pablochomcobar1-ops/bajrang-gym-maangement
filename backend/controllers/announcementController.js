const Announcement = require("../models/Announcement");

// @desc   Get all announcements (everyone)
// @route  GET /api/announcements
const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Create an announcement (admin only)
// @route  POST /api/announcements
const createAnnouncement = async (req, res) => {
  try {
    const { title, message, type } = req.body;

    const announcement = await Announcement.create({
      title,
      message,
      type,
      postedBy: req.user._id,
    });

    const populated = await announcement.populate("postedBy", "name");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Delete an announcement (admin only)
// @route  DELETE /api/announcements/:id
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    await announcement.deleteOne();
    res.status(200).json({ message: "Announcement deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
};
