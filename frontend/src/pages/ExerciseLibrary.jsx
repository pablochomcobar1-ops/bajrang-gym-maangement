import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import toast from "react-hot-toast";
import ConfirmDialog from "../components/ConfirmDialog";
import TiltCard from "../components/TiltCard";

function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    muscleGroup: "chest",
    difficulty: "beginner",
    description: "",
    equipmentNeeded: "",
    videoUrl: "",
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const canManage = user?.role === "admin" || user?.role === "trainer";

  const muscleGroups = [
    "chest",
    "back",
    "legs",
    "shoulders",
    "arms",
    "core",
    "cardio",
  ];

  const fetchExercises = async () => {
    try {
      const query = filter ? `?muscleGroup=${filter}` : "";
      const res = await API.get(`/exercises${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExercises(res.data);
    } catch (err) {
      toast.error("Failed to load exercises");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [filter]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/exercises", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExercises([...exercises, res.data]);
      setFormData({
        name: "",
        muscleGroup: "chest",
        difficulty: "beginner",
        description: "",
        equipmentNeeded: "",
        videoUrl: "",
      });
      setShowForm(false);
      toast.success("Exercise added");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add exercise");
    }
  };

  const confirmDelete = (id) => setConfirmDeleteId(id);

  const handleDelete = async () => {
    try {
      await API.delete(`/exercises/${confirmDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExercises(exercises.filter((ex) => ex._id !== confirmDeleteId));
      toast.success("Exercise deleted");
    } catch (err) {
      toast.error("Failed to delete exercise");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const difficultyColor = {
    beginner: "text-accent-lime",
    intermediate: "text-yellow-400",
    advanced: "text-red-400",
  };

  if (loading) return <p className="text-text text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-base p-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="font-display text-3xl font-bold text-text">
          Exercise Library
        </h1>
        {canManage && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-accent-violet to-accent-pink text-white px-4 py-2 rounded-xl font-medium hover:brightness-110 transition active:scale-[0.98]"
          >
            {showForm ? "Cancel" : "+ New Exercise"}
          </button>
        )}
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("")}
          className={`px-3 py-1.5 rounded-xl text-sm capitalize transition ${
            filter === ""
              ? "bg-gradient-to-r from-accent-violet to-accent-pink text-white"
              : "bg-surface-light text-text-muted hover:text-text"
          }`}
        >
          All
        </button>
        {muscleGroups.map((mg) => (
          <button
            key={mg}
            onClick={() => setFilter(mg)}
            className={`px-3 py-1.5 rounded-xl text-sm capitalize transition ${
              filter === mg
                ? "bg-gradient-to-r from-accent-violet to-accent-pink text-white"
                : "bg-surface-light text-text-muted hover:text-text"
            }`}
          >
            {mg}
          </button>
        ))}
      </div>

      {canManage && showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl mb-6 max-w-md space-y-3"
        >
          <input
            name="name"
            placeholder="Exercise name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
          />
          <select
            name="muscleGroup"
            value={formData.muscleGroup}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-surface-light text-text outline-none focus:ring-2 focus:ring-accent-violet"
          >
            {muscleGroups.map((mg) => (
              <option key={mg} value={mg}>
                {mg}
              </option>
            ))}
          </select>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-surface-light text-text outline-none focus:ring-2 focus:ring-accent-violet"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
          />
          <input
            name="equipmentNeeded"
            placeholder="Equipment needed (optional)"
            value={formData.equipmentNeeded}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
          />
          <input
            name="videoUrl"
            placeholder="Video URL (optional)"
            value={formData.videoUrl}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
          />
          <button
            type="submit"
            className="w-full bg-accent-lime text-base font-semibold py-3 rounded-xl hover:brightness-110 transition"
          >
            Add Exercise
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map((ex, i) => (
          <motion.div
            key={ex._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            style={{ perspective: "1000px" }}
          >
            <TiltCard className="bg-surface/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl text-text shadow-[0_0_40px_-15px_rgba(242,128,30,0.3)] hover:shadow-[0_0_50px_-10px_rgba(242,128,30,0.5)] transition-shadow">
              <div className="flex justify-between items-start mb-1">
                <h2 className="font-display text-lg font-bold">{ex.name}</h2>
                <span
                  className={`text-xs font-semibold capitalize ${difficultyColor[ex.difficulty]}`}
                >
                  {ex.difficulty}
                </span>
              </div>
              <p className="text-text-muted text-xs capitalize mb-2">
                {ex.muscleGroup}
              </p>
              <p className="text-text-muted text-sm mb-2">{ex.description}</p>
              {ex.equipmentNeeded && ex.equipmentNeeded !== "None" && (
                <p className="text-text-muted text-xs">
                  Equipment: {ex.equipmentNeeded}
                </p>
              )}
              {ex.videoUrl && (
                <a
                  href={ex.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent-violet text-sm hover:underline block mt-2"
                >
                  Watch video →
                </a>
              )}
              {canManage && (
                <button
                  onClick={() => confirmDelete(ex._id)}
                  className="mt-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-xl text-sm transition"
                >
                  Delete
                </button>
              )}
            </TiltCard>
          </motion.div>
        ))}

        {exercises.length === 0 && (
          <p className="text-text-muted">No exercises found.</p>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        message="Are you sure you want to delete this exercise?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}

export default ExerciseLibrary;
