const express = require("express");

const router = express.Router();

const {
  getPackages,
  getCategories,
  getCities,
  getRandomQuestion,
  getPublicAds,
getSingleAd,
} = require("../controllers/publicController");

router.get("/packages", getPackages);

router.get("/categories", getCategories);

router.get("/cities", getCities);

router.get("/questions/random", getRandomQuestion);
router.get("/ads", getPublicAds);

router.get("/ads/:slug", getSingleAd);

module.exports = router;