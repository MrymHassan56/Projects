const Ad = require("../models/Ad");
const Payment = require("../models/Payment");
const User = require("../models/User");
const SystemHealthLog = require("../models/SystemHealthLog");

const { calculateRankScore } = require("../services/ranking.service");
const logStatusChange = require("../utils/logStatusChange");
const logAuditAction = require("../utils/logAuditAction");
const createNotification = require("../utils/createNotification");

exports.getPaymentQueue = async (req, res) => {
  try {
    const payments = await Payment.find({
      status: "pending",
    })
      .populate("user", "fullName email")
      .populate("ad")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.log("Payment Queue Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment queue",
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { action, note } = req.body;

    const payment = await Payment.findById(req.params.id).populate("ad");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const ad = payment.ad;

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Related ad not found",
      });
    }

    const previousStatus = ad.status;

    if (action === "verify") {
      payment.status = "verified";
      payment.verifiedBy = req.user._id;
      payment.verifiedAt = new Date();
      ad.status = "payment_verified";
    } else if (action === "reject") {
      payment.status = "rejected";
      payment.adminNote = note;
      ad.status = "payment_rejected";
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid action",
      });
    }

    await payment.save();
    await ad.save();

    await logStatusChange({
      ad: ad._id,
      previousStatus,
      newStatus: ad.status,
      changedBy: req.user._id,
      note,
    });

    await logAuditAction({
      actor: req.user._id,
      actionType: `PAYMENT_${action.toUpperCase()}`,
      targetType: "Payment",
      targetId: payment._id,
      oldValue: previousStatus,
      newValue: ad.status,
      note,
    });

    if (action === "verify") {
      await createNotification({
        user: ad.user,
        type: "payment_verified",
        title: "Payment verified",
        message: `Your payment for "${ad.title}" has been verified by the admin.`,
        relatedId: ad._id,
      });
    }

    res.json({
      success: true,
      message: "Payment processed successfully",
    });
  } catch (error) {
    console.log("Verify Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

exports.publishAd = async (req, res) => {
  try {
    const { publishNow, publishAt, isFeatured = false, adminBoost = 0 } = req.body;

    const ad = await Ad.findById(req.params.id).populate("package");

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    if (ad.status !== "payment_verified") {
      return res.status(400).json({
        success: false,
        message: "Ad is not payment verified",
      });
    }

    const previousStatus = ad.status;
    ad.isFeatured = Boolean(isFeatured);
    ad.adminBoost = Number(adminBoost) || 0;

    if (publishNow) {
      ad.status = "published";
      ad.publishAt = new Date();
      ad.expireAt = new Date(
        Date.now() + (ad.package?.durationDays || 1) * 24 * 60 * 60 * 1000
      );
      ad.rankScore = calculateRankScore({
        isFeatured: ad.isFeatured,
        packageWeight: ad.package?.weight || 1,
        publishAt: ad.publishAt,
        adminBoost: ad.adminBoost,
      });
    } else {
      if (!publishAt) {
        return res.status(400).json({
          success: false,
          message: "publishAt is required for scheduled ads",
        });
      }

      ad.status = "scheduled";
      ad.publishAt = new Date(publishAt);
    }

    await ad.save();

    await logStatusChange({
      ad: ad._id,
      previousStatus,
      newStatus: ad.status,
      changedBy: req.user._id,
    });

    await logAuditAction({
      actor: req.user._id,
      actionType: publishNow ? "PUBLISH_AD" : "SCHEDULE_AD",
      targetType: "Ad",
      targetId: ad._id,
      oldValue: previousStatus,
      newValue: ad.status,
      note: publishNow ? "Published immediately" : `Scheduled for ${publishAt}`,
    });

    if (publishNow) {
      await createNotification({
        user: ad.user,
        type: "ad_approved",
        title: "Ad published",
        message: `Your ad "${ad.title}" has been published successfully.`,
        relatedId: ad._id,
      });
    }

    res.json({
      success: true,
      message: "Ad publishing updated",
      data: ad,
    });
  } catch (error) {
    console.log("Publish Ad Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to publish ad",
    });
  }
};

exports.getAnalyticsSummary = async (req, res) => {
  try {
    const [
      totalAds,
      activeAds,
      pendingReviews,
      rejectedAds,
      expiredAds,
      featuredAds,
      scheduledAds,
      totalClients,
      totalRevenueAgg,
      monthlyRevenueAgg,
      packageRevenueAgg,
      recentHealth,
      adsByCategory,
      adsByCity,
      approvedAds,
      pendingPayments,
    ] = await Promise.all([
      Ad.countDocuments(),
      Ad.countDocuments({ status: "published" }),
      Ad.countDocuments({ status: "submitted" }),
      Ad.countDocuments({ status: "moderator_rejected" }),
      Ad.countDocuments({ status: "expired" }),
      Ad.countDocuments({ isFeatured: true, status: "published" }),
      Ad.countDocuments({ status: "scheduled" }),
      User.countDocuments({ role: "client" }),
      Payment.aggregate([
        { $match: { status: "verified" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Payment.aggregate([
        { $match: { status: "verified", verifiedAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Payment.aggregate([
        { $match: { status: "verified" } },
        { $lookup: { from: "ads", localField: "ad", foreignField: "_id", as: "adDetails" } },
        { $unwind: "$adDetails" },
        { $lookup: { from: "packages", localField: "adDetails.package", foreignField: "_id", as: "packageDetails" } },
        { $unwind: { path: "$packageDetails", preserveNullAndEmptyArrays: true } },
        { $group: { _id: "$packageDetails.name", total: { $sum: "$amount" } } },
      ]),
      SystemHealthLog.find().sort({ checkedAt: -1 }).limit(5),
      Ad.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "categoryDetails" } },
        { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
        { $project: { name: "$categoryDetails.name", count: 1 } },
      ]),
      Ad.aggregate([
        { $group: { _id: "$city", count: { $sum: 1 } } },
        { $lookup: { from: "cities", localField: "_id", foreignField: "_id", as: "cityDetails" } },
        { $unwind: { path: "$cityDetails", preserveNullAndEmptyArrays: true } },
        { $project: { name: "$cityDetails.name", count: 1 } },
      ]),
      Ad.countDocuments({ status: "moderator_approved" }),
      Payment.countDocuments({ status: "pending" }),
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;
    const monthlyRevenue = monthlyRevenueAgg[0]?.total || 0;
    const approvalRate = totalAds ? Math.round((approvedAds / totalAds) * 100) : 0;
    const rejectionRate = totalAds ? Math.round((rejectedAds / totalAds) * 100) : 0;

    res.json({
      success: true,
      data: {
        listings: {
          total: totalAds,
          active: activeAds,
          pendingReviews,
          rejected: rejectedAds,
          expired: expiredAds,
          featured: featuredAds,
          scheduled: scheduledAds,
        },
        revenue: {
          total: totalRevenue,
          monthly: monthlyRevenue,
          byPackage: packageRevenueAgg,
        },
        users: {
          totalClients,
        },
        operations: {
          paymentQueue: pendingPayments,
          approvalRate,
          rejectionRate,
        },
        breakdown: {
          byCategory: adsByCategory,
          byCity: adsByCity,
        },
        systemHealth: recentHealth,
      },
    });
  } catch (error) {
    console.log("Analytics Error:", error);
    res.status(500).json({
      success: false,
      message: "Analytics failed",
    });
  }
};