const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    ad: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ad",
      required: true,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    method: {
      type: String,
      enum: [
        "bank_transfer",
        "easypaisa",
        "jazzcash",
        "other",
      ],
      required: true,
    },

    transactionRef: {
      type: String,
      required: true,
      unique: true,
    },

    senderName: {
      type: String,
      required: true,
    },

    screenshotUrl: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    adminNote: String,

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    verifiedAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Payment",
  paymentSchema
);