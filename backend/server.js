const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env"), override: true });
const cors = require("cors");
const express = require("express");
const passport = require("passport");
const { connectDatabase, getDatabaseStatus } = require("./config/database");
const Router = require("./routes/routes");
const itinerariesRouter = require("./routes/itinerariesroutes");
const routerUser = require("./routes/routesUser");
const activitiesroutes = require("./routes/activitiesroutes");

const PORT = Number(process.env.PORT) || 4000;

const app = express();

// Configure CORS with allowed local origins
const allowedOrigins = (
  process.env.CORS_ORIGINS || "http://localhost:3000,http://127.0.0.1:3000"
)
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like curl, Postman, or server-to-server) or matching allowed origins
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Health & Ping endpoints
app.get(["/api/health", "/health", "/api/ping", "/ping"], (req, res) => {
  res.status(200).json({
    status: "OK",
    success: true,
    service: "MyTinerary Backend API",
    port: PORT,
    database: getDatabaseStatus(),
    timestamp: new Date().toISOString(),
  });
});

// Middleware to ensure Database is connected before executing any route in Serverless / Standalone
app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (err) {
    console.error("[Database Middleware Error]:", err.message);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// API Routes mounted on both "/api" and "/" for seamless Vercel Serverless & local compatibility
app.use(["/api", "/"], Router);
app.use(["/api", "/"], itinerariesRouter);
app.use(["/api", "/"], routerUser);
app.use(["/api", "/"], activitiesroutes);

// 404 Handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Centralized Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("[GlobalErrorHandler]", err.stack || err.message || err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Prevent silent crashes from unhandled rejections
process.on("unhandledRejection", (reason) => {
  console.error("[Process] Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("[Process] Uncaught Exception:", err);
});

async function startServer() {
  await connectDatabase();
  const server = app.listen(PORT, () => {
    console.log(`Server ready on PORT ${PORT}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`[Server] Port ${PORT} is already in use.`);
      process.exit(1);
    } else {
      console.error("[Server] Error starting server:", err);
    }
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;
