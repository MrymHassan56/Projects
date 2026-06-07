const mongoose = require("mongoose");

const systemHealthLogSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["ok", "error"],
      required: true,
    },
    responseMs: {
      type: Number,
      default: 0,
    },
    message: String,
    checkedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SystemHealthLog", systemHealthLogSchema);
