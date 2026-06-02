const Ad = require("../models/Ad");
const { calculateRankScore } = require("../services/ranking.service");
const logStatusChange = require("../utils/logStatusChange");
const logSystemHealth = require("../utils/logSystemHealth");
const createNotification = require("../utils/createNotification");

exports.publishScheduledAdsNow = async (req, res) => {
  const start = Date.now();

  try {
    const ads = await Ad.find({
      status: "scheduled",
      publishAt: { $lte: new Date() },
    }).populate("package");

    for (const ad of ads) {
      const previousStatus = ad.status;
      ad.status = "published";
      ad.expireAt = new Date(
        Date.now() + (ad.package?.durationDays || 1) * 24 * 60 * 60 * 1000
      );
      ad.rankScore = calculateRankScore({
        isFeatured: ad.isFeatured,
        packageWeight: ad.package?.weight || 1,
        publishAt: ad.publishAt,
        adminBoost: ad.adminBoost,
      });

      await ad.save();

      await logStatusChange({
        ad: ad._id,
        previousStatus,
        newStatus: "published",
        changedBy: ad.user,
      });

      await createNotification({
        user: ad.user,
        type: "ad_approved",
        title: "Ad published",
        message: `Your ad "${ad.title}" is now live on AdFlow Pro.`,
        relatedId: ad._id,
      });
    }

    await logSystemHealth({
      source: "manual-publish-scheduled",
      status: "ok",
      responseMs: Date.now() - start,
      message: `Manually published ${ads.length} scheduled ads`,
    });

    res.json({
      success: true,
      message: `Published ${ads.length} scheduled ads`,
    });
  } catch (error) {
    await logSystemHealth({
      source: "manual-publish-scheduled",
      status: "error",
      responseMs: Date.now() - start,
      message: error.message,
    });

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.expireAdsNow = async (req, res) => {
  const start = Date.now();

  try {
    const ads = await Ad.find({
      status: "published",
      expireAt: { $lte: new Date() },
    });

    for (const ad of ads) {
      const previousStatus = ad.status;
      ad.status = "expired";
      ad.rankScore = 0;
      await ad.save();

      await logStatusChange({
        ad: ad._id,
        previousStatus,
        newStatus: "expired",
        changedBy: ad.user,
      });

      await createNotification({
        user: ad.user,
        type: "ad_expired",
        title: "Ad expired",
        message: `Your ad "${ad.title}" has expired and is no longer public.`,
        relatedId: ad._id,
      });
    }

    await logSystemHealth({
      source: "manual-expire-ads",
      status: "ok",
      responseMs: Date.now() - start,
      message: `Expired ${ads.length} ads`,
    });

    res.json({
      success: true,
      message: `Expired ${ads.length} ads`,
    });
  } catch (error) {
    await logSystemHealth({
      source: "manual-expire-ads",
      status: "error",
      responseMs: Date.now() - start,
      message: error.message,
    });

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
