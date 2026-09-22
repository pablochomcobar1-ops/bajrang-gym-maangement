import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import toast from "react-hot-toast";
import ConfirmDialog from "../components/ConfirmDialog";
import TiltCard from "../components/TiltCard";

function Plans() {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    durationInMonths: "",
    price: "",
    description: "",
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const fetchPlans = async () => {
    try {
      const res = await API.get("/plans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/plans", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans([...plans, res.data]);
      setFormData({
        name: "",
        durationInMonths: "",
        price: "",
        description: "",
      });
      setShowForm(false);
      toast.success("Plan created");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create plan");
    }
  };

  const confirmDelete = (id) => setConfirmDeleteId(id);

  const handleDelete = async () => {
    try {
      await API.delete(`/plans/${confirmDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans(plans.filter((p) => p._id !== confirmDeleteId));
      toast.success("Plan deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete plan");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  if (loading) return <p className="text-text text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-base p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl font-bold text-text">
          Membership Plans
        </h1>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-accent-violet to-accent-pink text-white px-4 py-2 rounded-xl font-medium hover:brightness-110 transition active:scale-[0.98]"
          >
            {showForm ? "Cancel" : "+ New Plan"}
          </button>
        )}
      </div>

      {error && (
        <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-4 max-w-md">
          {error}
        </p>
      )}

      {isAdmin && showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl mb-6 max-w-md space-y-3"
        >
          <input
            name="name"
            placeholder="Plan Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
          />
          <input
            name="durationInMonths"
            type="number"
            placeholder="Duration (months)"
            value={formData.durationInMonths}
            onChange={handleChange}
            required
            min="1"
            className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
          />
          <input
            name="description"
            placeholder="Description (optional)"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
          />
          <button
            type="submit"
            className="bg-accent-lime text-base font-semibold px-4 py-2 rounded-xl hover:brightness-110 transition"
          >
            Create Plan
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan, i) => (
          <motion.div
            key={plan._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            style={{ perspective: "1000px" }}
          >
            <TiltCard className="bg-surface/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl text-text shadow-[0_0_40px_-15px_rgba(242,128,30,0.3)] hover:shadow-[0_0_50px_-10px_rgba(242,128,30,0.5)] transition-shadow">
              <h2 className="font-display text-xl font-bold">{plan.name}</h2>
              <p className="text-text-muted mt-1">
                {plan.durationInMonths} month(s)
              </p>
              <p className="text-2xl font-bold mt-2 text-accent-lime">
                ₹{plan.price}
              </p>
              {plan.description && (
                <p className="text-text-muted text-sm mt-2">
                  {plan.description}
                </p>
              )}
              {isAdmin && (
                <button
                  onClick={() => confirmDelete(plan._id)}
                  className="mt-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-xl text-sm transition"
                >
                  Delete
                </button>
              )}
            </TiltCard>
          </motion.div>
        ))}
      </div>

      {plans.length === 0 && !error && (
        <p className="text-text-muted mt-4">No plans available yet.</p>
      )}

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        message="Are you sure you want to delete this plan?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}

export default Plans;
