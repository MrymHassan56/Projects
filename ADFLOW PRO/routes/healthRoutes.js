const express = require("express");
const mongoose = require("mongoose");

const logSystemHealth = require("../utils/logSystemHealth");

const router = express.Router();

router.get("/db", async (req, res) => {
  const start = Date.now();

  try {
    const isConnected = mongoose.connection.readyState === 1;
    const responseMs = Date.now() - start;

    await logSystemHealth({
      source: "db-heartbeat",
      status: isConnected ? "ok" : "error",
      responseMs,
      message: isConnected ? "Database heartbeat successful" : "Database heartbeat failed",
    });

    res.json({
      success: true,
      status: isConnected ? "ok" : "error",
      database: isConnected ? "connected" : "disconnected",
      responseMs,
    });
  } catch (error) {
    const responseMs = Date.now() - start;

    await logSystemHealth({
      source: "db-heartbeat",
      status: "error",
      responseMs,
      message: error.message,
    });

    res.status(503).json({
      success: false,
      status: "error",
      database: "disconnected",
      responseMs,
      message: error.message,
    });
  }
});

module.exports = router;