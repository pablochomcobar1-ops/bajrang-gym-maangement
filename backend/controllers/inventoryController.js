const InventoryItem = require("../models/InventoryItem");

// @desc   Get all inventory items
// @route  GET /api/inventory
const getAllItems = async (req, res) => {
  try {
    const items = await InventoryItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Create a new inventory item (admin only)
// @route  POST /api/inventory
const createItem = async (req, res) => {
  try {
    const { name, category, quantity, condition } = req.body;
    const item = await InventoryItem.create({
      name,
      category,
      quantity,
      condition,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Update an inventory item (admin only)
// @route  PUT /api/inventory/:id
const updateItem = async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const { name, category, quantity, condition } = req.body;
    item.name = name || item.name;
    item.category = category || item.category;
    item.quantity = quantity ?? item.quantity;
    item.condition = condition || item.condition;

    const updatedItem = await item.save();
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Delete an inventory item (admin only)
// @route  DELETE /api/inventory/:id
const deleteItem = async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await item.deleteOne();
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAllItems, createItem, updateItem, deleteItem };
