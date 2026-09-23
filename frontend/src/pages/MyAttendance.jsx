import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import toast from "react-hot-toast";

function MyAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await API.get("/attendance/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecords(res.data);
      } catch (err) {
        toast.error("Failed to load attendance history");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  if (loading) return <p className="text-text text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-base p-4 sm:p-6 md:p-8">
      <h1 className="font-display text-3xl font-bold text-text mb-6">
        My Check-In History
      </h1>

      <div className="space-y-2 max-w-md">
        {records.map((record, i) => (
          <motion.div
            key={record._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.02 }}
            className="bg-surface/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl flex justify-between items-center"
          >
            <span className="text-text">
              {new Date(record.createdAt).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-text-muted text-sm">
              {new Date(record.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </motion.div>
        ))}

        {records.length === 0 && (
          <p className="text-text-muted">
            No check-ins yet — visit the gym and get scanned in!
          </p>
        )}
      </div>
    </div>
  );
}

export default MyAttendance;
