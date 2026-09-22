import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

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

  return (
    <nav className="bg-surface/80 backdrop-blur-xl border-b border-white/10 px-6 py-3 flex items-center justify-between flex-wrap gap-2 sticky top-0 z-40">
      <div className="flex items-center gap-2 flex-wrap">
        <Link to="/dashboard" className="flex items-center gap-2 mr-4">
          <img
            src="/logo.png"
            alt="Bajrang GYM"
            className="w-9 h-9 rounded-full"
          />
          <span className="font-display text-text font-bold text-lg">
            Bajrang GYM
          </span>
        </Link>

        <Link to="/dashboard" className={linkClass("/dashboard")}>
          Dashboard
        </Link>
        <Link to="/plans" className={linkClass("/plans")}>
          Plans
        </Link>
        <Link to="/ai-plan" className={linkClass("/ai-plan")}>
          AI Plan
        </Link>
        <Link to="/chatbot" className={linkClass("/chatbot")}>
          Chatbot
        </Link>
        <Link to="/leaderboard" className={linkClass("/leaderboard")}>
          Leaderboard
        </Link>
        <Link to="/inventory" className={linkClass("/inventory")}>
          Inventory
        </Link>
        <Link to="/exercises" className={linkClass("/exercises")}>
          Exercises
        </Link>
        {isAdmin && (
          <>
            <Link to="/members" className={linkClass("/members")}>
              Members
            </Link>
            <Link to="/analytics" className={linkClass("/analytics")}>
              Analytics
            </Link>
            <Link to="/feedback-admin" className={linkClass("/feedback-admin")}>
              Feedback
            </Link>
          </>
        )}
        {(user?.role === "admin" || user?.role === "receptionist") && (
          <Link to="/checkin" className={linkClass("/checkin")}>
            Check-In
          </Link>
        )}
        {(user?.role === "trainer" || user?.role === "dietician") && (
          <>
            <Link to="/assign-plan" className={linkClass("/assign-plan")}>
              Assign Plan
            </Link>
            <Link
              to="/member-progress"
              className={linkClass("/member-progress")}
            >
              Member Progress
            </Link>
            <Link
              to="/manage-appointments"
              className={linkClass("/manage-appointments")}
            >
              Appointments
            </Link>
          </>
        )}
        {user?.role === "member" && (
          <>
            <Link to="/my-plans" className={linkClass("/my-plans")}>
              My Plans
            </Link>
            <Link to="/progress" className={linkClass("/progress")}>
              Progress
            </Link>
            <Link to="/feedback" className={linkClass("/feedback")}>
              Feedback
            </Link>
            <Link
              to="/book-appointment"
              className={linkClass("/book-appointment")}
            >
              Appointments
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-text text-sm font-medium">{user?.name}</span>
          <span className="bg-gradient-to-r from-accent-violet to-accent-pink text-white text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
            {user?.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-surface-light hover:bg-red-500/20 hover:text-red-400 text-text-muted text-sm px-3 py-1.5 rounded-xl transition border border-white/10"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
