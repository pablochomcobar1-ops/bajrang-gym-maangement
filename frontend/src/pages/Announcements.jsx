import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import toast from "react-hot-toast";
import ConfirmDialog from "../components/ConfirmDialog";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "general",
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const typeColor = {
    event: "bg-accent-violet/20 text-accent-violet",
    holiday: "bg-accent-lime/20 text-accent-lime",
    general: "bg-surface-light text-text-muted",
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await API.get("/announcements", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(res.data);

      // Mark as seen — store the newest announcement's timestamp locally
      if (res.data.length > 0) {
        localStorage.setItem("lastSeenAnnouncement", res.data[0].createdAt);
      }
    } catch (err) {
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/announcements", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements([res.data, ...announcements]);
      setFormData({ title: "", message: "", type: "general" });
      setShowForm(false);
      toast.success("Announcement posted");
      localStorage.setItem("lastSeenAnnouncement", res.data.createdAt);
    } catch (err) {
      toast.error("Failed to post announcement");
    }
  };

  const confirmDelete = (id) => setConfirmDeleteId(id);

  const handleDelete = async () => {
    try {
      await API.delete(`/announcements/${confirmDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(announcements.filter((a) => a._id !== confirmDeleteId));
      toast.success("Announcement removed");
    } catch (err) {
      toast.error("Failed to delete announcement");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  if (loading) return <p className="text-text text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-base p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="font-display text-3xl font-bold text-text">
          Announcements
        </h1>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-accent-violet to-accent-pink text-white px-4 py-2 rounded-xl font-medium hover:brightness-110 transition active:scale-[0.98]"
          >
            {showForm ? "Cancel" : "+ New Announcement"}
          </button>
        )}
      </div>

      {isAdmin && showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl mb-6 max-w-md space-y-3"
        >
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-surface-light text-text outline-none focus:ring-2 focus:ring-accent-violet"
          >
            <option value="general">General</option>
            <option value="event">Event</option>
            <option value="holiday">Holiday</option>
          </select>
          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
          />
          <button
            type="submit"
            className="w-full bg-accent-lime text-base font-semibold py-3 rounded-xl hover:brightness-110 transition"
          >
            Post Announcement
          </button>
        </form>
      )}

      <div className="space-y-3 max-w-2xl">
        {announcements.map((a, i) => (
          <motion.div
            key={a._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="bg-surface/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl text-text"
          >
            <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
              <h2 className="font-display text-lg font-bold">{a.title}</h2>
              <span
                className={`text-xs font-semibold capitalize px-2.5 py-1 rounded-full ${typeColor[a.type]}`}
              >
                {a.type}
              </span>
            </div>
            <p className="text-text-muted text-sm mb-2">{a.message}</p>
            <p className="text-text-muted text-xs">
              Posted by {a.postedBy?.name} —{" "}
              {new Date(a.createdAt).toLocaleDateString()}
            </p>
            {isAdmin && (
              <button
                onClick={() => confirmDelete(a._id)}
                className="mt-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-xl text-sm transition"
              >
                Delete
              </button>
            )}
          </motion.div>
        ))}
        {announcements.length === 0 && (
          <p className="text-text-muted">No announcements yet.</p>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        message="Are you sure you want to delete this announcement?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}

export default Announcements;
