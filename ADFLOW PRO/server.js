const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

// Database Connection
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const publicRoutes = require("./routes/publicRoutes");
const clientRoutes = require("./routes/clientRoutes");
const moderatorRoutes = require("./routes/moderatorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const healthRoutes = require("./routes/healthRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const cronRoutes = require("./routes/cronRoutes");
// Cron Jobs
const publishScheduledAds = require("./cron/publishScheduled");
const expireAds = require("./cron/expireAds");

// Initialize App
const app = express();

// Environment Variables
dotenv.config();

// Database Connection
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Port
const PORT = process.env.PORT || 5000;

// Default Route
app.get("/", (req, res) => {
  res.send("AdFlow Pro API Running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", publicRoutes);

app.use("/api/client", clientRoutes);
app.use("/api/moderator", moderatorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/cron", cronRoutes);

// Run Cron Jobs
publishScheduledAds();
expireAds();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});