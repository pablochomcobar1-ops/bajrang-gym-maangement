const mongoose = require("mongoose");

const progressLogSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
    },
    bodyFatPercent: {
      type: Number,
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

module.exports = mongoose.model("ProgressLog", progressLogSchema);
