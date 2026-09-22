const Exercise = require("../models/Exercise");

// @desc   Get all exercises (everyone), optionally filtered by muscle group
// @route  GET /api/exercises
const getAllExercises = async (req, res) => {
  try {
    const { muscleGroup } = req.query;
    const filter = muscleGroup ? { muscleGroup } : {};

    const exercises = await Exercise.find(filter).sort({ name: 1 });
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Create a new exercise (admin/trainer only)
// @route  POST /api/exercises
const createExercise = async (req, res) => {
  try {
    const {
      name,
      muscleGroup,
      difficulty,
      description,
      equipmentNeeded,
      videoUrl,
    } = req.body;

    const exercise = await Exercise.create({
      name,
      muscleGroup,
      difficulty,
      description,
      equipmentNeeded,
      videoUrl,
    });

    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Delete an exercise (admin/trainer only)
// @route  DELETE /api/exercises/:id
const deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    await exercise.deleteOne();
    res.status(200).json({ message: "Exercise deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAllExercises, createExercise, deleteExercise };
