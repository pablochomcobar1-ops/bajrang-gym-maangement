import { useState, useEffect } from "react";
import API from "../api/axios";

function MyPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await API.get("/assigned-plans/my-plans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlans(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) return <p className="text-text text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-base p-8">
      <h1 className="font-display text-3xl font-bold text-text mb-6">
        My Assigned Plans
      </h1>

      <div className="space-y-3">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="bg-surface/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl text-text"
          >
            <div className="flex justify-between items-start">
              <p className="font-semibold">{plan.title}</p>
              <span className="text-xs bg-gradient-to-r from-accent-violet to-accent-pink px-2 py-1 rounded-lg capitalize">
                {plan.type}
              </span>
            </div>
            <p className="text-text-muted text-sm mt-1">
              Assigned by: {plan.assignedBy?.name} ({plan.assignedBy?.role})
            </p>
            <p className="text-text-muted text-sm mt-2">{plan.details}</p>
          </div>
        ))}
        {plans.length === 0 && (
          <p className="text-text-muted">No plans assigned to you yet.</p>
        )}
      </div>
    </div>
  );
}

export default MyPlans;
