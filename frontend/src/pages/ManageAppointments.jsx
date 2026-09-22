import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    try {
      const res = await API.get("/appointments/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      toast.error("Failed to load appointment requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await API.put(
        `/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAppointments(appointments.map((a) => (a._id === id ? res.data : a)));
      toast.success(`Appointment ${status}`);
    } catch (err) {
      toast.error("Failed to update appointment");
    }
  };

  const statusColor = {
    pending: "text-yellow-400",
    confirmed: "text-accent-lime",
    cancelled: "text-red-400",
    completed: "text-text-muted",
  };

  if (loading) return <p className="text-text text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-base p-8">
      <h1 className="font-display text-3xl font-bold text-text mb-6">
        Appointment Requests
      </h1>

      <div className="space-y-3 max-w-2xl">
        {appointments.map((appt) => (
          <div
            key={appt._id}
            className="bg-surface/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl text-text"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-semibold">{appt.member?.name}</span>
                <span className="text-text-muted text-sm">
                  {" "}
                  ({appt.member?.email})
                </span>
              </div>
              <span
                className={`text-sm font-semibold capitalize ${statusColor[appt.status]}`}
              >
                {appt.status}
              </span>
            </div>
            <p className="text-text-muted text-sm mt-1">
              {new Date(appt.dateTime).toLocaleString()}
            </p>
            {appt.note && (
              <p className="text-text-muted text-sm mt-2">{appt.note}</p>
            )}

            {appt.status === "pending" && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleStatusChange(appt._id, "confirmed")}
                  className="bg-accent-lime/20 hover:bg-accent-lime/30 text-accent-lime px-3 py-1 rounded-lg text-sm transition"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleStatusChange(appt._id, "cancelled")}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-lg text-sm transition"
                >
                  Decline
                </button>
              </div>
            )}
            {appt.status === "confirmed" && (
              <button
                onClick={() => handleStatusChange(appt._id, "completed")}
                className="mt-3 bg-accent-violet/20 hover:bg-accent-violet/30 text-accent-violet px-3 py-1 rounded-lg text-sm transition"
              >
                Mark Completed
              </button>
            )}
          </div>
        ))}
        {appointments.length === 0 && (
          <p className="text-text-muted">No appointment requests yet.</p>
        )}
      </div>
    </div>
  );
}

export default ManageAppointments;
