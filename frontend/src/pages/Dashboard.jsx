import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-accent-violet/20 rounded-full blur-[100px] top-10 left-10" />
      <div className="absolute w-96 h-96 bg-accent-lime/10 rounded-full blur-[120px] bottom-10 right-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative text-center bg-surface/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
      >
        <h1 className="font-display text-3xl font-bold text-text mb-1">
          Welcome, {user?.name}!
        </h1>
        <p className="text-text-muted mb-1 capitalize">{user?.role}</p>
        <p className="text-accent-lime font-semibold mb-6">
          ⭐ {user?.points || 0} points
        </p>

        <div className="bg-white p-4 rounded-2xl inline-block mb-2">
          <QRCodeSVG value={user?._id || ""} size={160} />
        </div>
        <p className="text-text-muted text-sm">
          Show this at the front desk to check in
        </p>
      </motion.div>
    </div>
  );
}

export default Dashboard;
