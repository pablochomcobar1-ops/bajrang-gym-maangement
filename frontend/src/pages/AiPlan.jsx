import { useState } from "react";
import API from "../api/axios";

function AiPlan() {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    goal: "",
    experience: "",
    dietPreference: "",
    injuries: "",
  });
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPlan(null);
    setLoading(true);
    try {
      const res = await API.post("/ai/generate-plan", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlan(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base p-8">
      <h1 className="font-display text-3xl font-bold text-text mb-6">
        AI Workout & Diet Plan Generator
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl mb-8 max-w-md space-y-3"
      >
        <input
          name="age"
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
          min="1"
          className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
        />
        <input
          name="weight"
          type="number"
          placeholder="Weight (kg)"
          value={formData.weight}
          onChange={handleChange}
          required
          min="1"
          className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
        />
        <input
          name="height"
          type="number"
          placeholder="Height (cm)"
          value={formData.height}
          onChange={handleChange}
          required
          min="1"
          className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
        />
        <select
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl bg-surface-light text-text outline-none focus:ring-2 focus:ring-accent-violet"
        >
          <option value="">Select a goal</option>
          <option value="weight loss">Weight Loss</option>
          <option value="muscle gain">Muscle Gain</option>
          <option value="general fitness">General Fitness</option>
          <option value="endurance">Endurance</option>
        </select>
        <select
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl bg-surface-light text-text outline-none focus:ring-2 focus:ring-accent-violet"
        >
          <option value="">Select experience level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select
          name="dietPreference"
          value={formData.dietPreference}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl bg-surface-light text-text outline-none focus:ring-2 focus:ring-accent-violet"
        >
          <option value="">Select dietary preference</option>
          <option value="no restrictions">No Restrictions</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="eggetarian">Eggetarian</option>
        </select>

        <input
          name="injuries"
          placeholder="Injuries or limitations (optional)"
          value={formData.injuries}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-accent-violet to-accent-pink text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 hover:brightness-110 active:scale-[0.98]"
        >
          {loading
            ? "Generating... (this can take a few seconds)"
            : "Generate Plan"}
        </button>
      </form>

      {error && (
        <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-4 max-w-md">
          {error}
        </p>
      )}

      {plan && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div className="bg-surface/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl text-text">
            <h2 className="font-display text-xl font-bold mb-3">
              Workout Plan
            </h2>
            {plan.workoutPlan?.map((day, index) => (
              <div key={index} className="mb-3">
                <p className="font-semibold text-accent-violet">
                  {day.day} — {day.focus}
                </p>
                <ul className="list-disc list-inside text-text-muted text-sm">
                  {day.exercises?.map((exercise, i) => (
                    <li key={i}>{exercise}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-surface/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl text-text">
            <h2 className="font-display text-xl font-bold mb-3">Diet Plan</h2>
            <p className="mb-2">
              <span className="text-accent-lime font-semibold">
                Breakfast:{" "}
              </span>
              {plan.dietPlan?.breakfast}
            </p>
            <p className="mb-2">
              <span className="text-accent-lime font-semibold">Lunch: </span>
              {plan.dietPlan?.lunch}
            </p>
            <p className="mb-2">
              <span className="text-accent-lime font-semibold">Dinner: </span>
              {plan.dietPlan?.dinner}
            </p>
            <p className="mb-2">
              <span className="text-accent-lime font-semibold">Snacks: </span>
              {plan.dietPlan?.snacks}
            </p>
            {plan.notes && (
              <p className="text-text-muted text-sm mt-4 italic">
                {plan.notes}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AiPlan;
