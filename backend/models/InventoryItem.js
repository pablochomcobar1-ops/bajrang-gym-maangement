const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["cardio", "strength", "free weights", "accessories", "other"],
      default: "other",
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: 0,
      default: 1,
    },
    condition: {
      type: String,
      enum: ["new", "good", "needs repair", "out of service"],
      default: "good",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);
