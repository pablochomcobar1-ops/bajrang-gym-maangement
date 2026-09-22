const { generateFitnessPlan } = require("../services/aiService");
const User = require("../models/user");

const generatePlan = async (req, res) => {
  try {
    const { age, weight, height, goal, experience, dietPreference, injuries } =
      req.body;

    if (!age || !weight || !height || !goal || !experience || !dietPreference) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    const plan = await generateFitnessPlan({
      age,
      weight,
      height,
      goal,
      experience,
      dietPreference,
      injuries,
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { points: 10 } });

    res.status(200).json(plan);
  } catch (error) {
    console.error("AI generation error:", error.message);
    res
      .status(500)
      .json({ message: "Failed to generate plan", error: error.message });
  }
};

module.exports = { generatePlan };
