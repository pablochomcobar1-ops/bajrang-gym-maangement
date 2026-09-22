import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

function Feedback() {
  const [formData, setFormData] = useState({
    category: "facility",
    rating: 5,
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/feedback", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ category: "facility", rating: 5, comment: "" });
      toast.success("Thanks for your feedback!");
    } catch (err) {
      toast.error("Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-surface/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-sm"
      >
        <h2 className="font-display text-2xl font-bold text-text mb-1 text-center">
          Share Feedback
        </h2>
        <p className="text-text-muted text-sm text-center mb-6">
          Help us improve your experience
        </p>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full mb-3 p-3 rounded-xl bg-surface-light text-text outline-none focus:ring-2 focus:ring-accent-violet"
        >
          <option value="facility">Facility</option>
          <option value="trainer">Trainer</option>
          <option value="equipment">Equipment</option>
          <option value="staff">Staff</option>
          <option value="other">Other</option>
        </select>

        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setFormData({ ...formData, rating: star })}
              className={`text-3xl transition ${star <= formData.rating ? "text-accent-lime" : "text-surface-light"}`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          name="comment"
          placeholder="Tell us more (optional)"
          value={formData.comment}
          onChange={handleChange}
          rows={4}
          className="w-full mb-6 p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-accent-violet to-accent-pink text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 hover:brightness-110 active:scale-[0.98]"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}

export default Feedback;
