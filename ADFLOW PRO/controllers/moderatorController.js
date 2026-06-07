const Ad = require("../models/Ad");
const AdMedia = require("../models/AdMedia");

const logStatusChange = require("../utils/logStatusChange");
const logAuditAction = require("../utils/logAuditAction");
const createNotification = require("../utils/createNotification");

exports.getReviewQueue = async (req, res) => {
  try {
    const ads = await Ad.find({
      status: "submitted",
    })
      .populate("user", "fullName email")
      .populate("category", "name")
      .populate("city", "name")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: ads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSingleReviewAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id)
      .populate("user", "fullName email")
      .populate("category")
      .populate("city");

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    const media = await AdMedia.find({
      ad: ad._id,
    }).sort({ order: 1 });

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

exports.reviewAd = async (req, res) => {
  try {
    const { action, note } = req.body;

    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    if (ad.status !== "submitted") {
      return res.status(400).json({
        success: false,
        message: "Ad is not in submitted state",
      });
    }

    const previousStatus = ad.status;
    let nextStatus = null;

    if (action === "approve") {
      nextStatus = "moderator_approved";
    } else if (action === "reject") {
      if (!note) {
        return res.status(400).json({
          success: false,
          message: "Rejection note required",
        });
      }

      nextStatus = "moderator_rejected";
      ad.moderationNote = note;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid action",
      });
    }

    ad.status = nextStatus;
    await ad.save();

    await logStatusChange({
      ad: ad._id,
      previousStatus,
      newStatus: nextStatus,
      changedBy: req.user._id,
      note,
    });

    await logAuditAction({
      actor: req.user._id,
      actionType: `MODERATOR_${action.toUpperCase()}`,
      targetType: "Ad",
      targetId: ad._id,
      oldValue: previousStatus,
      newValue: nextStatus,
      note,
    });

    if (action === "approve") {
      await createNotification({
        user: ad.user,
        type: "ad_approved",
        title: "Ad approved",
        message: `Your ad "${ad.title}" has been approved by the moderator.`,
        relatedId: ad._id,
      });
    } else {
      await createNotification({
        user: ad.user,
        type: "ad_rejected",
        title: "Ad rejected",
        message: `Your ad "${ad.title}" was rejected: ${note}`,
        relatedId: ad._id,
      });
    }

    res.json({
      success: true,
      message: `Ad ${action}d successfully`,
      data: ad,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};