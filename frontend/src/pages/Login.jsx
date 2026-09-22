import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-4 relative overflow-hidden">
      {/* Soft glow blobs in the background — used once, deliberately */}
      <div className="absolute w-96 h-96 bg-accent-violet/30 rounded-full blur-[100px] -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-accent-pink/20 rounded-full blur-[100px] -bottom-20 -right-20" />

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="relative bg-surface/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-sm"
      >
        <img
          src="/logo.png"
          alt="Bajrang GYM"
          className="w-16 h-16 rounded-full mx-auto mb-3"
        />
        <h2 className="font-display text-3xl font-bold text-text mb-1 text-center">
          Welcome back
        </h2>
        <p className="text-text-muted text-sm text-center mb-6">
          Log in to keep the streak going
        </p>

        {error && (
          <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-4">
            {error}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full mb-3 p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet transition"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mb-6 p-3 rounded-xl bg-surface-light text-text placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-violet transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-accent-violet to-accent-pink text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 hover:brightness-110 active:scale-[0.98]"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-text-muted text-sm text-center mt-5">
          New here?{" "}
          <Link to="/register" className="text-accent-lime hover:underline">
            Create an account
          </Link>
        </p>
      </motion.form>
    </div>
  );
}

export default Login;
