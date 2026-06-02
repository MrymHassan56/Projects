const mongoose = require("mongoose");

const adStatusHistorySchema = new mongoose.Schema(
  {
    ad: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ad",
      required: true,
    },

    previousStatus: {
      type: String,
      default: null,
    },

    newStatus: {
      type: String,
      required: true,
    },

    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    note: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AdStatusHistory",
  adStatusHistorySchema
);