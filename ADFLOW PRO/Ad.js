const mongoose = require("mongoose");
const slugify = require("slugify");

const adSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      default: null,
    },

    contactPhone: {
      type: String,
    },

    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "moderator_approved",
        "moderator_rejected",
        "payment_pending",
        "payment_submitted",
        "payment_verified",
        "payment_rejected",
        "scheduled",
        "published",
        "expired",
      ],
      default: "draft",
    },

    moderationNote: String,

    adminNote: String,

    isFeatured: {
      type: Boolean,
      default: false,
    },

    adminBoost: {
      type: Number,
      default: 0,
    },

    rankScore: {
      type: Number,
      default: 0,
    },

    publishAt: Date,

    expireAt: Date,
  },
  {
    timestamps: true,
  }
);

adSchema.pre("save", async function () {
  if (!this.title) {
    return;
  }

  if (!this.slug || this.isModified("title")) {
    const baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
    });

    this.slug = `${baseSlug}-${this._id?.toString() || Date.now()}`;
  }
});

module.exports = mongoose.model("Ad", adSchema);