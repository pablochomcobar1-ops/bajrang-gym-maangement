import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import API from "../api/axios";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const checkUnread = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/announcements", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.length > 0) {
          const lastSeen = localStorage.getItem("lastSeenAnnouncement");
          const newest = res.data[0].createdAt;
          setHasUnread(!lastSeen || new Date(newest) > new Date(lastSeen));
        }
      } catch (err) {
        // Silently ignore — this is a non-critical background check
      }
    };
    checkUnread();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkClass = (path) =>
    `px-3 py-2 rounded-xl text-sm font-medium transition ${
      location.pathname === path
        ? "bg-gradient-to-r from-accent-violet to-accent-pink text-white"
        : "text-text-muted hover:bg-surface-light hover:text-text"
    }`;

  // Same links used in both desktop nav and mobile drawer, built once
  const links = (
    <>
      <Link
        to="/announcements"
        className={linkClass("/announcements")}
        onClick={() => {
          setMenuOpen(false);
          setHasUnread(false);
        }}
      >
        📢 Announcements
      </Link>
      <Link
        to="/dashboard"
        className={linkClass("/dashboard")}
        onClick={() => setMenuOpen(false)}
      >
        Dashboard
      </Link>
      <Link
        to="/dashboard"
        className={linkClass("/dashboard")}
        onClick={() => setMenuOpen(false)}
      >
        Dashboard
      </Link>
      <Link
        to="/plans"
        className={linkClass("/plans")}
        onClick={() => setMenuOpen(false)}
      >
        Plans
      </Link>
      <Link
        to="/ai-plan"
        className={linkClass("/ai-plan")}
        onClick={() => setMenuOpen(false)}
      >
        AI Plan
      </Link>
      <Link
        to="/chatbot"
        className={linkClass("/chatbot")}
        onClick={() => setMenuOpen(false)}
      >
        Chatbot
      </Link>
      <Link
        to="/leaderboard"
        className={linkClass("/leaderboard")}
        onClick={() => setMenuOpen(false)}
      >
        Leaderboard
      </Link>
      <Link
        to="/inventory"
        className={linkClass("/inventory")}
        onClick={() => setMenuOpen(false)}
      >
        Inventory
      </Link>
      <Link
        to="/exercises"
        className={linkClass("/exercises")}
        onClick={() => setMenuOpen(false)}
      >
        Exercises
      </Link>
      {isAdmin && (
        <>
          <Link
            to="/members"
            className={linkClass("/members")}
            onClick={() => setMenuOpen(false)}
          >
            Members
          </Link>
          <Link
            to="/analytics"
            className={linkClass("/analytics")}
            onClick={() => setMenuOpen(false)}
          >
            Analytics
          </Link>
          <Link
            to="/feedback-admin"
            className={linkClass("/feedback-admin")}
            onClick={() => setMenuOpen(false)}
          >
            Feedback
          </Link>
        </>
      )}
      {(user?.role === "admin" || user?.role === "receptionist") && (
        <Link
          to="/checkin"
          className={linkClass("/checkin")}
          onClick={() => setMenuOpen(false)}
        >
          Check-In
        </Link>
      )}
      {(user?.role === "trainer" || user?.role === "dietician") && (
        <>
          <Link
            to="/assign-plan"
            className={linkClass("/assign-plan")}
            onClick={() => setMenuOpen(false)}
          >
            Assign Plan
          </Link>
          <Link
            to="/member-progress"
            className={linkClass("/member-progress")}
            onClick={() => setMenuOpen(false)}
          >
            Member Progress
          </Link>
          <Link
            to="/manage-appointments"
            className={linkClass("/manage-appointments")}
            onClick={() => setMenuOpen(false)}
          >
            Appointments
          </Link>
        </>
      )}
      {user?.role === "member" && (
        <>
          <Link
            to="/my-plans"
            className={linkClass("/my-plans")}
            onClick={() => setMenuOpen(false)}
          >
            My Plans
          </Link>
          <Link
            to="/progress"
            className={linkClass("/progress")}
            onClick={() => setMenuOpen(false)}
          >
            Progress
          </Link>
          <Link
            to="/feedback"
            className={linkClass("/feedback")}
            onClick={() => setMenuOpen(false)}
          >
            Feedback
          </Link>
          <Link
            to="/book-appointment"
            className={linkClass("/book-appointment")}
            onClick={() => setMenuOpen(false)}
          >
            Appointments
          </Link>
        </>
      )}
    </>
  );

  return (
    <>
      <nav className="bg-surface/80 backdrop-blur-xl border-b border-white/10 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {/* Hamburger — visible only on mobile, now first in the layout */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-text p-2 rounded-xl hover:bg-surface-light transition -ml-2"
            aria-label="Open menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <img
            src="/logo.png"
            alt="Bajrang GYM"
            className="w-9 h-9 rounded-full"
          />
          <span className="font-display text-text font-bold text-lg">
            Bajrang GYM
          </span>
        </div>

        {/* Desktop links — hidden on mobile */}
        {/* Desktop links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-2 flex-wrap">
          {links}
          <Link
            to="/announcements"
            className="relative p-2 rounded-xl hover:bg-surface-light transition"
            onClick={() => setHasUnread(false)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-text-muted"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {hasUnread && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent-lime rounded-full" />
            )}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-text text-sm font-medium">{user?.name}</span>
            <span className="bg-gradient-to-r from-accent-violet to-accent-pink text-white text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
              {user?.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="hidden md:block bg-surface-light hover:bg-red-500/20 hover:text-red-400 text-text-muted text-sm px-3 py-1.5 rounded-xl transition border border-white/10"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 left-0 h-full w-72 bg-surface border-r border-white/10 z-50 p-6 overflow-y-auto md:hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-text font-medium">{user?.name}</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-text-muted p-2"
                  aria-label="Close menu"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <span className="bg-gradient-to-r from-accent-violet to-accent-pink text-white text-xs font-semibold px-2.5 py-1 rounded-full capitalize inline-block mb-4">
                {user?.role}
              </span>
              <div className="flex flex-col gap-1">{links}</div>
              <button
                onClick={handleLogout}
                className="mt-6 w-full bg-surface-light hover:bg-red-500/20 hover:text-red-400 text-text-muted text-sm px-3 py-2 rounded-xl transition border border-white/10"
              >
                Logout
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
