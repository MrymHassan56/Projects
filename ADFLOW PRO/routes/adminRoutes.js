const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles =
  require("../middleware/roleMiddleware");

const {
  getPaymentQueue,
  verifyPayment,
  publishAd,
  getAnalyticsSummary,
} = require("../controllers/adminController");

router.use(protect);

router.use(
  authorizeRoles(
    "admin",
    "super_admin"
  )
);

router.get(
  "/payment-queue",
  getPaymentQueue
);

router.patch(
  "/payments/:id/verify",
  verifyPayment
);

router.patch(
  "/ads/:id/publish",
  publishAd
);

router.get(
  "/analytics/summary",
  getAnalyticsSummary
);

module.exports = router;