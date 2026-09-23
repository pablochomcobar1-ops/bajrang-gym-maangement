import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import API from "../api/axios";

function Analytics() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/analytics/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="text-text text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-400 text-center mt-10">{error}</p>;

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const chartData = stats.membersPerMonth.map((entry) => ({
    label: `${monthNames[entry._id.month - 1]} ${entry._id.year}`,
    count: entry.count,
  }));

  return (
    <div className="min-h-screen bg-base p-4 sm:p-6 md:p-8">
      <h1 className="font-display text-3xl font-bold text-text mb-6">
        Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-text">
          <p className="text-text-muted text-sm">Total Members</p>
          <p className="text-4xl font-bold mt-1 text-accent-lime">
            {stats.totalMembers}
          </p>
        </div>
        <div className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-text">
          <p className="text-text-muted text-sm">Total Membership Plans</p>
          <p className="text-4xl font-bold mt-1 text-accent-lime">
            {stats.totalPlans}
          </p>
        </div>
        <div className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-text">
          <p className="text-text-muted text-sm">Check-Ins Today</p>
          <p className="text-4xl font-bold mt-1 text-accent-lime">
            {stats.todayCheckIns}
          </p>
        </div>
        <div className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-text">
          <p className="text-text-muted text-sm">Expiring This Week</p>
          <p className="text-4xl font-bold mt-1 text-yellow-400">
            {stats.expiringSoonCount}
          </p>
        </div>
        <div className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-text">
          <p className="text-text-muted text-sm">Active Revenue</p>
          <p className="text-4xl font-bold mt-1 text-accent-lime">
            ₹{stats.totalRevenue}
          </p>
          <p className="text-text-muted text-xs mt-1">
            {stats.activeMemberships} active
          </p>
        </div>
      </div>

      <div className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
        <h2 className="font-display text-xl font-bold text-text mb-4">
          New Members (Last 6 Months)
        </h2>
        {chartData.length === 0 ? (
          <p className="text-text-muted">No member data yet in this period.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2550" />
              <XAxis dataKey="label" stroke="#8b82a8" />
              <YAxis stroke="#8b82a8" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#16132b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default Analytics;
