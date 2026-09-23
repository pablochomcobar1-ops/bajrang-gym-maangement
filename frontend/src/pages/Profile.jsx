import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    setLoading(true);
    try {
      await API.put(
        "/auth/change-password",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Password updated successfully");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base p-4 sm:p-6 md:p-8">
      <h1 className="font-display text-3xl font-bold text-text mb-6">
        My Profile
      </h1>

      <div className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl max-w-md mb-6">
        <p className="text-text-muted text-sm">Name</p>
        <p className="text-text mb-3">{user?.name}</p>
        <p className="text-text-muted text-sm">Email</p>
        <p className="text-text mb-3">{user?.email}</p>
        <p className="text-text-muted text-sm">Role</p>
        <p className="text-text capitalize">{user?.role}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl max-w-md space-y-3"
      >
        <h2 className="font-display text-xl font-bold text-text mb-2">
          Change Password
        </h2>
        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={formData.currentPassword}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          required
          minLength={6}
          className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength={6}
          className="w-full p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-accent-violet to-accent-pink text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 hover:brightness-110 active:scale-[0.98]"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

export default Profile;
