const mongoose = require("mongoose");
const slugify = require("slugify");

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    slug: {
      type: String,
      unique: true,
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

citySchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    strict: true,
  });

  next();
});

module.exports = mongoose.model("City", citySchema);