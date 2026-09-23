import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import toast from "react-hot-toast";
import QrScanner from "../components/QrScanner";

function CheckIn() {
  const [members, setMembers] = useState([]);
  const [todayRecords, setTodayRecords] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [scanning, setScanning] = useState(false);

  const fetchData = async () => {
    try {
      const [membersRes, todayRes] = await Promise.all([
        API.get("/users", { headers: { Authorization: `Bearer ${token}` } }),
        API.get("/attendance/today", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setMembers(membersRes.data);
      setTodayRecords(todayRes.data);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;

    try {
      const res = await API.post(
        "/attendance",
        { member: selectedMember },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTodayRecords([res.data, ...todayRecords]);
      setSelectedMember("");
      toast.success("Member checked in");
    } catch (err) {
      toast.error(err.response?.data?.message || "Check-in failed");
    }
  };

  const handleScanSuccess = async (memberId) => {
    setScanning(false);
    try {
      const res = await API.post(
        "/attendance",
        { member: memberId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTodayRecords([res.data, ...todayRecords]);
      toast.success(`${res.data.member?.name || "Member"} checked in`);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Check-in failed — invalid or already scanned",
      );
    }
  };

  if (loading) return <p className="text-text text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-base p-4 sm:p-6 md:p-8">
      <h1 className="font-display text-3xl font-bold text-text mb-6">
        Member Check-In
      </h1>

      <div className="mb-8 max-w-md">
        <button
          onClick={() => setScanning(!scanning)}
          className="mb-4 bg-gradient-to-r from-accent-violet to-accent-pink text-white px-5 py-2.5 rounded-xl font-medium hover:brightness-110 transition"
        >
          {scanning ? "Close Scanner" : "📷 Scan QR Code"}
        </button>

        {scanning && (
          <QrScanner
            onScanSuccess={handleScanSuccess}
            onClose={() => setScanning(false)}
          />
        )}

        {!scanning && (
          <form
            onSubmit={handleCheckIn}
            className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col sm:flex-row gap-3"
          >
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              required
              className="flex-1 p-3 rounded-xl bg-surface-light text-text outline-none focus:ring-2 focus:ring-accent-violet"
            >
              <option value="">Select a member</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-gradient-to-r from-accent-violet to-accent-pink text-white px-5 py-3 rounded-xl font-semibold transition hover:brightness-110 active:scale-[0.98]"
            >
              Check In
            </button>
          </form>
        )}
      </div>

      <h2 className="font-display text-xl font-bold text-text mb-4">
        Today's Check-Ins ({todayRecords.length})
      </h2>

      <div className="space-y-2 max-w-md">
        {todayRecords.map((record, i) => (
          <motion.div
            key={record._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            className="bg-surface/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl flex justify-between items-center"
          >
            <span className="text-text">{record.member?.name}</span>
            <span className="text-text-muted text-sm">
              {new Date(record.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </motion.div>
        ))}

        {todayRecords.length === 0 && (
          <p className="text-text-muted">No check-ins yet today.</p>
        )}
      </div>
    </div>
  );
}

export default CheckIn;
