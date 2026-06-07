const Ad = require("../models/Ad");
const AdMedia = require("../models/AdMedia");
const Package = require("../models/Package");
const Payment = require("../models/Payment");

const logStatusChange = require("../utils/logStatusChange");
const logAuditAction = require("../utils/logAuditAction");
const createNotification = require("../utils/createNotification");
const { normalizeMediaUrl } = require("../services/media.service");

exports.createAd = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      city,
      price,
      contactPhone,
      mediaUrls = [],
    } = req.body;

    if (!title || !description || !category || !city) {
      return res.status(400).json({
        success: false,
        message: "Title, description, category, and city are required",
      });
    }

    const ad = await Ad.create({
      user: req.user._id,
      title,
      description,
      category,
      city,
      price,
      contactPhone,
      status: "draft",
    });

    if (mediaUrls.length > 0) {
      const mediaDocs = mediaUrls
        .filter(Boolean)
        .map((url, index) => ({
          ad: ad._id,
          ...normalizeMediaUrl(url),
          order: index,
        }));

      if (mediaDocs.length > 0) {
        await AdMedia.insertMany(mediaDocs);
      }
    }

    await logStatusChange({
      ad: ad._id,
      previousStatus: null,
      newStatus: "draft",
      changedBy: req.user._id,
    });

    await logAuditAction({
      actor: req.user._id,
      actionType: "CREATE_AD",
      targetType: "Ad",
      targetId: ad._id,
      note: "Client created an ad draft",
    });

    res.status(201).json({
      success: true,
      data: ad,
    });
  } catch (error) {
    if (next) return next(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getDashboardAds = async (req, res) => {
  try {
    const ads = await Ad.find({ user: req.user._id })
      .populate("category", "name")
      .populate("city", "name")
      .populate("package", "label name durationDays weight")
      .sort({ createdAt: -1 });

    const adsWithMedia = await Promise.all(
      ads.map(async (ad) => {
        const media = await AdMedia.find({ ad: ad._id }).sort({ order: 1 });

        return {
          ...ad.toObject(),
          media,
        };
      })
    );

    res.json({ success: true, data: adsWithMedia });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitAdForReview = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    if (ad.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (ad.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft ads can be submitted",
      });
    }

    const previousStatus = ad.status;
    ad.status = "submitted";
    await ad.save();

    await logStatusChange({
      ad: ad._id,
      previousStatus,
      newStatus: "submitted",
      changedBy: req.user._id,
    });

    await logAuditAction({
      actor: req.user._id,
      actionType: "SUBMIT_FOR_REVIEW",
      targetType: "Ad",
      targetId: ad._id,
      oldValue: previousStatus,
      newValue: "submitted",
    });

    res.json({
      success: true,
      message: "Ad submitted",
      data: ad,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    if (ad.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (ad.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft ads can be edited",
      });
    }

    const { title, description, category, city, price, contactPhone, mediaUrls = [] } = req.body;

    if (title) ad.title = title;
    if (description) ad.description = description;
    if (category) ad.category = category;
    if (city) ad.city = city;
    if (price !== undefined) ad.price = Number(price);
    if (contactPhone !== undefined) ad.contactPhone = contactPhone;

    await ad.save();

    if (Array.isArray(mediaUrls)) {
      await AdMedia.deleteMany({ ad: ad._id });

      const mediaDocs = mediaUrls
        .filter(Boolean)
        .map((url, index) => ({
          ad: ad._id,
          ...normalizeMediaUrl(url),
          order: index,
        }));

      if (mediaDocs.length > 0) {
        await AdMedia.insertMany(mediaDocs);
      }
    }

    await logAuditAction({
      actor: req.user._id,
      actionType: "UPDATE_AD",
      targetType: "Ad",
      targetId: ad._id,
      note: "Client updated draft ad",
    });

    res.json({
      success: true,
      data: ad,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    if (ad.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (ad.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft ads can be deleted",
      });
    }

    await AdMedia.deleteMany({ ad: ad._id });
    await ad.deleteOne();

    await logAuditAction({
      actor: req.user._id,
      actionType: "DELETE_AD",
      targetType: "Ad",
      targetId: ad._id,
      note: "Client deleted draft ad",
    });

    res.json({
      success: true,
      message: "Ad deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.selectPackage = async (req, res) => {
  try {
    const { packageId } = req.body;

    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ success: false, message: "Ad not found" });
    }

    if (ad.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (!["moderator_approved", "payment_pending"].includes(ad.status)) {
      return res.status(400).json({
        success: false,
        message: "Ad must be approved or already waiting for payment",
      });
    }

    const pkg = await Package.findById(packageId);

    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }

    const previousStatus = ad.status;
    ad.package = packageId;
    ad.status = "payment_pending";
    await ad.save();

    await logStatusChange({
      ad: ad._id,
      previousStatus,
      newStatus: "payment_pending",
      changedBy: req.user._id,
    });

    await logAuditAction({
      actor: req.user._id,
      actionType: "SELECT_PACKAGE",
      targetType: "Ad",
      targetId: ad._id,
      oldValue: previousStatus,
      newValue: "payment_pending",
      note: pkg.label,
    });

    res.json({ success: true, data: ad });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitPayment = async (req, res) => {
  try {
    const {
      adId,
      amount,
      method,
      transactionRef,
      senderName,
      screenshotUrl,
    } = req.body;

    const ad = await Ad.findById(adId);

    if (!ad) {
      return res.status(404).json({ success: false, message: "Ad not found" });
    }

    if (ad.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (ad.status !== "payment_pending") {
      return res.status(400).json({
        success: false,
        message: "Ad must be in payment pending state",
      });
    }

    const existing = await Payment.findOne({ transactionRef });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Transaction already used",
      });
    }

    const payment = await Payment.create({
      ad: adId,
      user: req.user._id,
      amount,
      method,
      transactionRef,
      senderName,
      screenshotUrl,
    });

    const previousStatus = ad.status;
    ad.status = "payment_submitted";
    await ad.save();

    await logStatusChange({
      ad: ad._id,
      previousStatus,
      newStatus: "payment_submitted",
      changedBy: req.user._id,
    });

    await logAuditAction({
      actor: req.user._id,
      actionType: "SUBMIT_PAYMENT",
      targetType: "Payment",
      targetId: payment._id,
      oldValue: previousStatus,
      newValue: "payment_submitted",
      note: transactionRef,
    });

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};