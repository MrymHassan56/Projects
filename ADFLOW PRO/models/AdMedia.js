const mongoose = require("mongoose");

const adMediaSchema = new mongoose.Schema(
  {
    ad: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ad",
      required: true,
    },

    sourceType: {
      type: String,
      enum: ["youtube", "image", "cloudinary", "unknown"],
      default: "unknown",
    },

    originalUrl: {
      type: String,
      required: true,
    },

    thumbnailUrl: {
      type: String,
    },

    validationStatus: {
      type: String,
      enum: ["pending", "valid", "invalid"],
      default: "pending",
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AdMedia", adMediaSchema);