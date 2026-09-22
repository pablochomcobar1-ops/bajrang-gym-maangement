import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

function AssignPlan() {
  const [members, setMembers] = useState([]);
  const [createdPlans, setCreatedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    member: "",
    type: "workout",
    title: "",
    details: "",
  });
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [membersRes, plansRes] = await Promise.all([
        API.get("/users", { headers: { Authorization: `Bearer ${token}` } }),
        API.get("/assigned-plans/created-by-me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setMembers(membersRes.data);
      setCreatedPlans(plansRes.data);
    } catch (err) {
      toast.error("Failed to load data");
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
      const res = await API.post("/assigned-plans", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCreatedPlans([res.data, ...createdPlans]);
      setFormData({ member: "", type: "workout", title: "", details: "" });
      toast.success("Plan assigned");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign plan");
    }
  };

  if (loading) return <p className="text-text text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-base p-8">
      <h1 className="font-display text-3xl font-bold text-text mb-6">
        Assign a Plan
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl mb-8 max-w-md space-y-3"
      >
        <select
          name="member"
          value={formData.member}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl bg-surface-light text-text outline-none focus:ring-2 focus:ring-accent-violet"
        >
          <option value="">Select a member</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name} ({m.email})
            </option>
          ))}
        </select>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-surface-light text-text outline-none focus:ring-2 focus:ring-accent-violet"
        >
          <option value="workout">Workout Plan</option>
          <option value="diet">Diet Plan</option>
        </select>
        <input
          name="title"
          placeholder="Plan Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
        />
        <textarea
          name="details"
          placeholder="Plan details..."
          value={formData.details}
          onChange={handleChange}
          required
          rows={4}
          className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-accent-violet to-accent-pink text-white font-semibold py-3 rounded-xl transition hover:brightness-110 active:scale-[0.98]"
        >
          Assign Plan
        </button>
      </form>

      <h2 className="font-display text-xl font-bold text-text mb-4">
        Plans You've Created
      </h2>
      <div className="space-y-3">
        {createdPlans.map((plan) => (
          <div
            key={plan._id}
            className="bg-surface/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl text-text"
          >
            <p className="font-semibold">{plan.title}</p>
            <p className="text-text-muted text-sm">
              For: {plan.member?.name} ({plan.member?.email}) — {plan.type}
            </p>
            <p className="text-text-muted text-sm mt-2">{plan.details}</p>
          </div>
        ))}
        {createdPlans.length === 0 && (
          <p className="text-text-muted">You haven't assigned any plans yet.</p>
        )}
      </div>
    </div>
  );
}

export default AssignPlan;
