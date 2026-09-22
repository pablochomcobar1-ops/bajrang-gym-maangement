const express = require("express");
const router = express.Router();
const {
  getAllExercises,
  createExercise,
  deleteExercise,
} = require("../controllers/exerciseController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

router.get("/", protect, getAllExercises);
router.post("/", protect, allowRoles("admin", "trainer"), createExercise);
router.delete("/:id", protect, allowRoles("admin", "trainer"), deleteExercise);

module.exports = router;
