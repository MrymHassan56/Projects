const Package = require("../models/Package");
const Category = require("../models/Category");
const City = require("../models/City");
const LearningQuestion = require("../models/LearningQuestion");
const Ad = require("../models/Ad");

const AdMedia = require("../models/AdMedia");

exports.getPackages = async (req, res) => {
  try {
    const packages = await Package.find({
      isActive: true,
    });

    res.json({
      success: true,
      data: packages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getCities = async (req, res) => {
  try {
    const cities = await City.find({
      isActive: true,
    });

    res.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getRandomQuestion = async (req, res) => {
  try {
    const questions = await LearningQuestion.aggregate([
      {
        $match: {
          isActive: true,
        },
      },
      {
        $sample: {
          size: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: questions[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPublicAds = async (req, res) => {
  try {
    const {
      search,
      category,
      city,
      sort = "rank",
      page = 1,
      limit = 12,
    } = req.query;

    const query = {
      status: "published",
      expireAt: { $gt: new Date() },
    };

    if (search) {
      query.$or = [
        {
          title: { $regex: search, $options: "i" },
        },
        {
          description: { $regex: search, $options: "i" },
        },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (city) {
      query.city = city;
    }

    const sortOption =
      sort === "newest"
        ? { createdAt: -1 }
        : sort === "price_asc"
          ? { price: 1 }
          : sort === "price_desc"
            ? { price: -1 }
            : { rankScore: -1, createdAt: -1 };

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const [ads, total] = await Promise.all([
      Ad.find(query)
        .populate("category", "name")
        .populate("city", "name")
        .populate("package", "label name weight isFeatured homepageVisibility")
        .sort(sortOption)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),
      Ad.countDocuments(query),
    ]);

    const adsWithMedia = await Promise.all(
      ads.map(async (ad) => {
        const media = await AdMedia.find({ ad: ad._id }).sort({ order: 1 });
        const firstMedia = media[0];
        const fallbackThumbnail =
          firstMedia?.validationStatus === "valid"
            ? firstMedia?.thumbnailUrl
            : firstMedia?.originalUrl || null;

        return {
          ...ad.toObject(),
          thumbnail: fallbackThumbnail || null,
          media,
        };
      })
    );

    res.json({
      success: true,
      data: {
        ads: adsWithMedia,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          pages: Math.ceil(total / limitNumber),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSingleAd = async (req, res) => {
  try {
    const ad = await Ad.findOne({
      slug: req.params.slug,
      status: "published",
      expireAt: { $gt: new Date() },
    })
      .populate("category", "name slug")
      .populate("city", "name slug")
      .populate("package", "label name weight isFeatured homepageVisibility durationDays")
      .populate("user", "fullName email");

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    const media = await AdMedia.find({ ad: ad._id }).sort({ order: 1 });

    res.json({
      success: true,
      data: {
        ad,
        media,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};