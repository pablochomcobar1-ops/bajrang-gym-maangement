const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Exercise name is required"],
      trim: true,
    },
    muscleGroup: {
      type: String,
      enum: ["chest", "back", "legs", "shoulders", "arms", "core", "cardio"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    equipmentNeeded: {
      type: String,
      default: "None",
    },
    videoUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Exercise", exerciseSchema);
