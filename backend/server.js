// Import the packages we installed
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const planRoutes = require("./routes/planRoutes");
const aiRoutes = require("./routes/aiRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const chatRoutes = require("./routes/chatRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const assignedPlanRoutes = require("./routes/assignedPlanRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const progressLogRoutes = require("./routes/progressLogRoutes");
const goalRoutes = require("./routes/goalRoutes");
const workoutLogRoutes = require("./routes/workoutLogRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const announcementRoutes = require("./routes/announcementRoutes");
// Create the server app
const app = express();
app.set("trust proxy", 1);

// Connect to database
connectDB();

// Middleware — must come BEFORE routes
app.use(helmet());
app.use(
  cors({
    origin: "https://bajrang-gym-maangement.vercel.app",
    credentials: true,
  }),
);
app.use(express.json());

// Rate limiter for auth routes specifically — stricter, since these are brute-force targets
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per window for these routes
  message: { message: "Too many attempts, please try again later" },
});

// General rate limiter for the rest of the API — more lenient
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: "Too many requests, please try again later" },
});

app.use("/api/auth", authLimiter);
app.use("/api", generalLimiter);

// Routes
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/assigned-plans", assignedPlanRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/progress-logs", progressLogRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/workout-logs", workoutLogRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/announcements", announcementRoutes);

app.get("/", (req, res) => {
  res.send("API is running !!!");
});

app.get("/test-analytics", (req, res) => {
  res.send("Test route working");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
