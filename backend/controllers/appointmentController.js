const Appointment = require("../models/Appointment");

// @desc   Request an appointment (member only)
// @route  POST /api/appointments
const createAppointment = async (req, res) => {
  try {
    const { with: withUserId, dateTime, note } = req.body;

    const appointment = await Appointment.create({
      member: req.user._id,
      with: withUserId,
      dateTime,
      note,
    });

    const populated = await appointment.populate("with", "name role");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get the logged-in member's own appointments
// @route  GET /api/appointments/mine
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ member: req.user._id })
      .populate("with", "name role")
      .sort({ dateTime: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get appointments booked with the logged-in trainer/dietician
// @route  GET /api/appointments/requests
const getMyRequests = async (req, res) => {
  try {
    const appointments = await Appointment.find({ with: req.user._id })
      .populate("member", "name email")
      .sort({ dateTime: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Update appointment status (trainer/dietician only, their own)
// @route  PUT /api/appointments/:id/status
const updateStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Only the trainer/dietician this appointment is with can update it
    if (appointment.with.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this appointment" });
    }

    appointment.status = req.body.status;
    const updated = await appointment.save();

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getMyRequests,
  updateStatus,
};
