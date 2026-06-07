const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getReviewQueue,
  getSingleReviewAd,
  reviewAd,
} = require("../controllers/moderatorController");

router.use(protect);

router.use(
  authorizeRoles(
    "moderator",
    "admin",
    "super_admin"
  )
);

router.get("/review-queue", getReviewQueue);

router.get("/ads/:id", getSingleReviewAd);

router.patch("/ads/:id/review", reviewAd);

module.exports = router;