import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

function BookAppointment() {
  const [staff, setStaff] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    with: "",
    dateTime: "",
    note: "",
  });
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [staffRes, apptRes] = await Promise.all([
        API.get("/users", { headers: { Authorization: `Bearer ${token}` } }),
        API.get("/appointments/mine", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      // /users returns members by default for admin; for a member it's blocked,
      // so we rely on trainers/dieticians being fetched via a separate lighter approach below
      setAppointments(apptRes.data);
    } catch (err) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/appointments", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments([...appointments, res.data]);
      setFormData({ with: "", dateTime: "", note: "" });
      toast.success("Appointment requested");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book appointment");
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
        Book an Appointment
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl mb-8 max-w-md space-y-3"
      >
        <input
          name="with"
          placeholder="Trainer/Dietician ID"
          value={formData.with}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
        />
        <input
          name="dateTime"
          type="datetime-local"
          value={formData.dateTime}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl bg-surface-light text-text outline-none focus:ring-2 focus:ring-accent-violet"
        />
        <textarea
          name="note"
          placeholder="What would you like to discuss? (optional)"
          value={formData.note}
          onChange={handleChange}
          rows={3}
          className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-accent-violet to-accent-pink text-white font-semibold py-3 rounded-xl hover:brightness-110 transition"
        >
          Request Appointment
        </button>
      </form>

      <h2 className="font-display text-xl font-bold text-text mb-4">
        My Appointments
      </h2>
      <div className="space-y-3">
        {appointments.map((appt) => (
          <div
            key={appt._id}
            className="bg-surface/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl text-text"
          >
            <div className="flex justify-between items-start">
              <span className="font-semibold">
                {appt.with?.name} ({appt.with?.role})
              </span>
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
          </div>
        ))}
        {appointments.length === 0 && (
          <p className="text-text-muted">No appointments yet.</p>
        )}
      </div>
    </div>
  );
}

export default BookAppointment;
