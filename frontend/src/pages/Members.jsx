import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import ConfirmDialog from "../components/ConfirmDialog";

function Members() {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [plans, setPlans] = useState([]);
  const [renewingId, setRenewingId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchMembers = async () => {
    try {
      const [membersRes, plansRes] = await Promise.all([
        API.get("/users", { headers: { Authorization: `Bearer ${token}` } }),
        API.get("/plans", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setMembers(membersRes.data);
      setPlans(plansRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const confirmDelete = (id) => setConfirmDeleteId(id);

  const handleDelete = async () => {
    try {
      await API.delete(`/users/${confirmDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(members.filter((m) => m._id !== confirmDeleteId));
      toast.success("Member deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete member");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const startEditing = (member) => {
    setEditingId(member._id);
    setEditForm({
      name: member.name,
      email: member.email,
      phone: member.phone || "",
    });
  };

  const cancelEditing = () => setEditingId(null);

  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const saveEdit = async (id) => {
    try {
      const res = await API.put(`/users/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(members.map((m) => (m._id === id ? res.data : m)));
      setEditingId(null);
      toast.success("Member updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update member");
    }
  };

  const handleRenew = async (memberId, planId) => {
    if (!planId) return;
    try {
      const res = await API.put(
        `/users/${memberId}/membership`,
        { planId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMembers(members.map((m) => (m._id === memberId ? res.data : m)));
      setRenewingId(null);
      toast.success("Membership updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update membership");
    }
  };

  if (loading) return <p className="text-text text-center mt-10">Loading...</p>;

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { label: "No plan", color: "text-text-muted" };

    const daysLeft = Math.ceil(
      (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24),
    );

    if (daysLeft < 0) return { label: "Expired", color: "text-red-400" };
    if (daysLeft <= 7)
      return { label: `${daysLeft}d left`, color: "text-yellow-400" };
    return { label: `${daysLeft}d left`, color: "text-accent-lime" };
  };

  return (
    <div className="min-h-screen bg-base p-4 sm:p-6 md:p-8">
      <h1 className="font-display text-3xl font-bold text-text mb-6">
        Members
      </h1>

      {error && (
        <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-4 max-w-md">
          {error}
        </p>
      )}

      <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-x-auto">
        <table className="w-full text-left text-text min-w-[700px]">
          <thead className="bg-surface-light">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3">Membership</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id} className="border-t border-white/5">
                {editingId === member._id ? (
                  <>
                    <td className="p-3">
                      <input
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="bg-surface-light p-1.5 rounded-lg w-full outline-none focus:ring-2 focus:ring-accent-violet"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="bg-surface-light p-1.5 rounded-lg w-full outline-none focus:ring-2 focus:ring-accent-violet"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        name="phone"
                        value={editForm.phone}
                        onChange={handleEditChange}
                        className="bg-surface-light p-1.5 rounded-lg w-full outline-none focus:ring-2 focus:ring-accent-violet"
                      />
                    </td>

                    <td className="p-3 text-text-muted capitalize">
                      {member.role}
                    </td>
                    <td className="p-3 text-text-muted">—</td>
                    <td className="p-3 text-text-muted">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => saveEdit(member._id)}
                        className="bg-accent-lime text-base px-3 py-1 rounded-lg text-sm font-medium hover:brightness-110 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-surface-light hover:bg-white/10 text-text px-3 py-1 rounded-lg text-sm transition"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{member.name}</td>
                    <td className="p-3 text-text-muted">{member.email}</td>
                    <td className="p-3 text-text-muted">
                      {member.phone || "—"}
                    </td>
                    <td className="p-3 capitalize text-text-muted">
                      {member.role}
                    </td>
                    <td className="p-3">
                      {renewingId === member._id ? (
                        <select
                          onChange={(e) =>
                            handleRenew(member._id, e.target.value)
                          }
                          defaultValue=""
                          className="bg-surface-light text-text text-sm p-1.5 rounded-lg outline-none"
                        >
                          <option value="" disabled>
                            Select plan
                          </option>
                          {plans.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={
                            getExpiryStatus(member.membershipExpiry).color
                          }
                        >
                          {member.membershipPlan?.name || "No plan"} —{" "}
                          {getExpiryStatus(member.membershipExpiry).label}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-text-muted">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => startEditing(member)}
                        className="bg-accent-violet/20 hover:bg-accent-violet/30 text-accent-violet px-3 py-1 rounded-lg text-sm transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          setRenewingId(
                            renewingId === member._id ? null : member._id,
                          )
                        }
                        className="bg-accent-lime/20 hover:bg-accent-lime/30 text-accent-lime px-3 py-1 rounded-lg text-sm transition"
                      >
                        {renewingId === member._id ? "Cancel" : "Renew"}
                      </button>
                      <button
                        onClick={() => confirmDelete(member._id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-lg text-sm transition"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && !error && (
          <p className="text-text-muted p-4">No members found.</p>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        message="Are you sure you want to delete this member?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}

export default Members;
