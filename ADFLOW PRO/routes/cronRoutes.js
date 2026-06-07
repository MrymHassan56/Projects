const express = require("express");

const router = express.Router();
const { publishScheduledAdsNow, expireAdsNow } = require("../controllers/cronController");

router.post("/publish-scheduled", publishScheduledAdsNow);
router.post("/expire-ads", expireAdsNow);

module.exports = router;
