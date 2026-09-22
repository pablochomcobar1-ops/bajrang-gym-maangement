import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import TiltCard from "../components/TiltCard";

function Leaderboard() {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get("/users/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMembers(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <p className="text-text text-center mt-10">Loading...</p>;

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="min-h-screen bg-base p-8">
      <h1 className="font-display text-3xl font-bold text-text mb-6">
        Leaderboard
      </h1>

      {error && (
        <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-4 max-w-md">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mb-4">
        {members.slice(0, 3).map((member, index) => (
          <motion.div
            key={member._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            style={{ perspective: "1000px" }}
          >
            <TiltCard className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-text text-center shadow-[0_0_40px_-15px_rgba(242,128,30,0.3)] hover:shadow-[0_0_50px_-10px_rgba(242,128,30,0.5)] transition-shadow">
              <p className="text-4xl mb-2">{medals[index]}</p>
              <p className="font-display font-bold text-lg">{member.name}</p>
              <p className="text-accent-lime font-semibold mt-1">
                {member.points} pts
              </p>
            </TiltCard>
          </motion.div>
        ))}
      </div>

      <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden max-w-md">
        {members.slice(3).map((member, index) => (
          <motion.div
            key={member._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex justify-between items-center px-5 py-3 border-b border-white/5 last:border-0"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg w-6">#{index + 4}</span>
              <span className="text-text">{member.name}</span>
            </div>
            <span className="text-accent-lime font-semibold">
              {member.points} pts
            </span>
          </motion.div>
        ))}
        {members.length === 0 && !error && (
          <p className="text-text-muted p-4">No members yet.</p>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
