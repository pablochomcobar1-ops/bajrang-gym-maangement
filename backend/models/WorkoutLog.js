const mongoose = require("mongoose");

const workoutLogSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    muscleGroups: {
      type: [String],
      enum: ["chest", "back", "legs", "shoulders", "arms", "core", "cardio"],
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("WorkoutLog", workoutLogSchema);
