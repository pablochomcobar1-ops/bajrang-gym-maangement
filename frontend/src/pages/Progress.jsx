import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { motion } from "framer-motion";
import API from "../api/axios";
import toast from "react-hot-toast";

function Progress() {
  const [logs, setLogs] = useState([]);
  const [goals, setGoals] = useState([]);
  const [muscleSummary, setMuscleSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  const [weightForm, setWeightForm] = useState({
    weight: "",
    bodyFatPercent: "",
    notes: "",
  });
  const [goalForm, setGoalForm] = useState({
    title: "",
    targetValue: "",
    unit: "kg",
  });
  const [workoutForm, setWorkoutForm] = useState([]);

  const token = localStorage.getItem("token");
  const muscleOptions = [
    "chest",
    "back",
    "legs",
    "shoulders",
    "arms",
    "core",
    "cardio",
  ];

  const fetchAll = async () => {
    try {
      const [logsRes, goalsRes, muscleRes] = await Promise.all([
        API.get("/progress-logs/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        API.get("/goals/me", { headers: { Authorization: `Bearer ${token}` } }),
        API.get("/workout-logs/muscle-summary", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setLogs(logsRes.data);
      setGoals(goalsRes.data);
      setMuscleSummary(muscleRes.data);
    } catch (err) {
      toast.error("Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleWeightSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/progress-logs", weightForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWeightForm({ weight: "", bodyFatPercent: "", notes: "" });
      toast.success("Progress logged");
      fetchAll();
    } catch (err) {
      toast.error("Failed to log progress");
    }
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/goals", goalForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoalForm({ title: "", targetValue: "", unit: "kg" });
      toast.success("Goal created");
      fetchAll();
    } catch (err) {
      toast.error("Failed to create goal");
    }
  };

  const toggleMuscle = (muscle) => {
    setWorkoutForm((prev) =>
      prev.includes(muscle)
        ? prev.filter((m) => m !== muscle)
        : [...prev, muscle],
    );
  };

  const handleWorkoutSubmit = async (e) => {
    e.preventDefault();
    if (workoutForm.length === 0)
      return toast.error("Select at least one muscle group");
    try {
      await API.post(
        "/workout-logs",
        { muscleGroups: workoutForm },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setWorkoutForm([]);
      toast.success("Workout logged");
      fetchAll();
    } catch (err) {
      toast.error("Failed to log workout");
    }
  };

  if (loading) return <p className="text-text text-center mt-10">Loading...</p>;

  const chartData = logs.map((log) => ({
    date: new Date(log.createdAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    weight: log.weight,
  }));

  return (
    <div className="min-h-screen bg-base p-4 sm:p-6 md:p-8 space-y-8">
      <h1 className="font-display text-3xl font-bold text-text">My Progress</h1>

      {/* Weight chart + log form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
          <h2 className="font-display text-xl font-bold text-text mb-4">
            Weight Over Time
          </h2>
          {chartData.length === 0 ? (
            <p className="text-text-muted">
              No entries yet — log your first one!
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2550" />
                <XAxis dataKey="date" stroke="#8b82a8" />
                <YAxis stroke="#8b82a8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#16132b",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#d4ff3f"
                  strokeWidth={2}
                  dot={{ fill: "#d4ff3f" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <form
          onSubmit={handleWeightSubmit}
          className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl space-y-3"
        >
          <h2 className="font-display text-xl font-bold text-text mb-2">
            Log Today's Weight
          </h2>
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weightForm.weight}
            onChange={(e) =>
              setWeightForm({ ...weightForm, weight: e.target.value })
            }
            required
            className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
          />
          <input
            type="number"
            placeholder="Body fat % (optional)"
            value={weightForm.bodyFatPercent}
            onChange={(e) =>
              setWeightForm({ ...weightForm, bodyFatPercent: e.target.value })
            }
            className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
          />
          <input
            type="text"
            placeholder="Notes (optional)"
            value={weightForm.notes}
            onChange={(e) =>
              setWeightForm({ ...weightForm, notes: e.target.value })
            }
            className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-accent-violet to-accent-pink text-white font-semibold py-3 rounded-xl hover:brightness-110 transition"
          >
            Log Entry
          </button>
        </form>
      </div>

      {/* Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
          <h2 className="font-display text-xl font-bold text-text mb-4">
            My Goals
          </h2>
          <div className="space-y-3">
            {goals.map((goal) => {
              const pct = Math.min(
                100,
                Math.round((goal.currentValue / goal.targetValue) * 100),
              );
              return (
                <div key={goal._id} className="bg-surface-light p-4 rounded-xl">
                  <div className="flex justify-between text-text mb-1">
                    <span>{goal.title}</span>
                    <span className="text-text-muted text-sm">
                      {goal.currentValue}/{goal.targetValue} {goal.unit}
                    </span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${goal.completed ? "bg-accent-lime" : "bg-accent-violet"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {goals.length === 0 && (
              <p className="text-text-muted">No goals yet.</p>
            )}
          </div>
        </div>

        <form
          onSubmit={handleGoalSubmit}
          className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl space-y-3"
        >
          <h2 className="font-display text-xl font-bold text-text mb-2">
            Set a New Goal
          </h2>
          <input
            type="text"
            placeholder="Goal title (e.g. Reach 75kg)"
            value={goalForm.title}
            onChange={(e) =>
              setGoalForm({ ...goalForm, title: e.target.value })
            }
            required
            className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
          />
          <input
            type="number"
            placeholder="Target value"
            value={goalForm.targetValue}
            onChange={(e) =>
              setGoalForm({ ...goalForm, targetValue: e.target.value })
            }
            required
            className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
          />
          <input
            type="text"
            placeholder="Unit (kg, reps, etc.)"
            value={goalForm.unit}
            onChange={(e) => setGoalForm({ ...goalForm, unit: e.target.value })}
            className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-accent-violet to-accent-pink text-white font-semibold py-3 rounded-xl hover:brightness-110 transition"
          >
            Create Goal
          </button>
        </form>
      </div>

      {/* Muscle group balance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
          <h2 className="font-display text-xl font-bold text-text mb-4">
            Muscle Balance (Last 30 Days)
          </h2>
          {muscleSummary.length === 0 ? (
            <p className="text-text-muted">No workouts logged yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={muscleSummary}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2550" />
                <XAxis dataKey="_id" stroke="#8b82a8" />
                <YAxis stroke="#8b82a8" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#16132b",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <form
          onSubmit={handleWorkoutSubmit}
          className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl"
        >
          <h2 className="font-display text-xl font-bold text-text mb-4">
            Log Today's Workout
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {muscleOptions.map((muscle) => (
              <button
                type="button"
                key={muscle}
                onClick={() => toggleMuscle(muscle)}
                className={`px-3 py-1.5 rounded-xl text-sm capitalize transition ${
                  workoutForm.includes(muscle)
                    ? "bg-gradient-to-r from-accent-violet to-accent-pink text-white"
                    : "bg-surface-light text-text-muted hover:text-text"
                }`}
              >
                {muscle}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-accent-lime text-base font-semibold py-3 rounded-xl hover:brightness-110 transition"
          >
            Log Workout
          </button>
        </form>
      </div>
    </div>
  );
}

export default Progress;
