import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

function FeedbackAdmin() {
  const [feedback, setFeedback] = useState([]);
  const [summary, setSummary] = useState({
    averageRating: 0,
    totalFeedback: 0,
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feedbackRes, summaryRes] = await Promise.all([
          API.get("/feedback", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get("/feedback/summary", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setFeedback(feedbackRes.data);
        setSummary(summaryRes.data);
      } catch (err) {
        toast.error("Failed to load feedback");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-text text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-base p-8">
      <h1 className="font-display text-3xl font-bold text-text mb-6">
        Member Feedback
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-md">
        <div className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-text">
          <p className="text-text-muted text-sm">Average Rating</p>
          <p className="text-4xl font-bold mt-1 text-accent-lime">
            {summary.averageRating?.toFixed(1) || "0.0"} ★
          </p>
        </div>
        <div className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-text">
          <p className="text-text-muted text-sm">Total Responses</p>
          <p className="text-4xl font-bold mt-1 text-accent-lime">
            {summary.totalFeedback}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {feedback.map((fb) => (
          <div
            key={fb._id}
            className="bg-surface/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl text-text"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-semibold">{fb.member?.name}</span>
              <span className="text-accent-lime">
                {"★".repeat(fb.rating)}
                {"☆".repeat(5 - fb.rating)}
              </span>
            </div>
            <p className="text-text-muted text-xs capitalize mb-2">
              {fb.category}
            </p>
            {fb.comment && (
              <p className="text-text-muted text-sm">{fb.comment}</p>
            )}
          </div>
        ))}
        {feedback.length === 0 && (
          <p className="text-text-muted">No feedback yet.</p>
        )}
      </div>
    </div>
  );
}

export default FeedbackAdmin;
