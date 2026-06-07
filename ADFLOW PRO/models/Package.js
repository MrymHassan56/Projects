const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["basic", "standard", "premium"],
      required: true,
      unique: true,
    },

    label: {
      type: String,
      required: true,
    },

    durationDays: {
      type: Number,
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    homepageVisibility: {
      type: Boolean,
      default: false,
    },

    autoRefreshDays: {
      type: Number,
      default: null,
    },

    price: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Package", packageSchema);