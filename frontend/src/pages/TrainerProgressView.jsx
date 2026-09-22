import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import API from "../api/axios";
import toast from "react-hot-toast";

function TrainerProgressView() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await API.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMembers(res.data);
      } catch (err) {
        toast.error("Failed to load members");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleSelectMember = async (id) => {
    setSelectedMember(id);
    if (!id) {
      setLogs([]);
      return;
    }

    setLogsLoading(true);
    try {
      const res = await API.get(`/progress-logs/member/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (err) {
      toast.error("Failed to load progress");
    } finally {
      setLogsLoading(false);
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
    <div className="min-h-screen bg-base p-8">
      <h1 className="font-display text-3xl font-bold text-text mb-6">
        Member Progress
      </h1>

      <select
        value={selectedMember}
        onChange={(e) => handleSelectMember(e.target.value)}
        className="w-full max-w-md p-3 rounded-xl bg-surface-light text-text outline-none focus:ring-2 focus:ring-accent-violet mb-6"
      >
        <option value="">Select a member to view progress</option>
        {members.map((m) => (
          <option key={m._id} value={m._id}>
            {m.name} ({m.email})
          </option>
        ))}
      </select>

      {logsLoading && <p className="text-text-muted">Loading progress...</p>}

      {!logsLoading && selectedMember && (
        <div className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl max-w-2xl">
          <h2 className="font-display text-xl font-bold text-text mb-4">
            Weight Over Time
          </h2>
          {chartData.length === 0 ? (
            <p className="text-text-muted">
              This member hasn't logged any progress yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
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
      )}
    </div>
  );
}

export default TrainerProgressView;
