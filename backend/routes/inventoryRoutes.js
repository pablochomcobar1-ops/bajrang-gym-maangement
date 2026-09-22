const express = require("express");
const router = express.Router();
const {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/inventoryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, getAllItems); // any logged-in user can view
router.post("/", protect, adminOnly, createItem);
router.put("/:id", protect, adminOnly, updateItem);
router.delete("/:id", protect, adminOnly, deleteItem);

module.exports = router;
