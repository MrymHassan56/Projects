const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createAd,
  getDashboardAds,
  submitAdForReview,
  updateAd,
  deleteAd,
  selectPackage,
  submitPayment,
} = require("../controllers/clientController");

// 🔐 Protect all routes
router.use(protect);
router.use(authorizeRoles("client"));

// 📊 Dashboard
router.get("/dashboard", getDashboardAds);

// 📝 Create Ad
router.post("/ads", createAd);

// 📤 Submit Ad for Review
router.patch("/ads/:id/submit", submitAdForReview);

// ✏️ Update Draft
router.patch("/ads/:id", updateAd);

// 🗑️ Delete Draft
router.delete("/ads/:id", deleteAd);

// 📦 Select Package
router.patch("/ads/:id/package", selectPackage);

// 💳 Submit Payment
router.post("/payments", submitPayment);

module.exports = router;