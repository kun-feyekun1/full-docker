
'use strict';

const EmailService = require('../services/emailService');
const Notification = require('../mongoModels/Notification');
const mongoose = require("mongoose");

const sendMeetingReminder = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const result = await EmailService.sendNoticeEmailsForAll({ userId });

    if (result.success) {
      return res.status(200).json({
        message: 'Meeting reminder emails sent successfully.',
        details: result.results,
      });
    }

    return res.status(500).json({
      message: 'Failed to send meeting reminder emails.',
      error: result.error,
    });

  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const sendNotificationEmail = async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    const userId = req.user?.id || null;

    if (!to || !subject || !html) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const result =  EmailService.sendLoginNotificationEmail({ to, subject, html, userId });

    if (result.error) {
      return res.status(500).json({ message: 'Failed to send email.', error: result.error });
    }

    res.status(200).json({ message: result.message, notification: result.notification });

  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const sendOrderConfirmationEmail = async (req, res) => {
  try {
    // Ensure req.body exists
    const body = req.body || {};
    const userId = req.user?.id || null;

    // Destructure safely
    const userEmail = body.userEmail || req.user?.email;
    const orderDetails = body.orderDetails;

    // Validate required fields
    if (!userEmail || !orderDetails) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields. Provide orderDetails and userEmail.',
      });
    }

    // Call service
    const result = await EmailService.sendOrderConfirmation({ userEmail, userId, orderDetails });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Order confirmation sent successfully.',
        notification: result.notification,
      });
    }

    // Service failure
    return res.status(500).json({
      success: false,
      message: 'Failed to send order confirmation email.',
      error: result.error,
    });

  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const query = { deleted: { $ne: true } };

    const notifications = await Notification.find(query)
      .skip(skip)
      .limit(limitNum);

    const total = await Notification.countDocuments(query);

    res.status(200).json({
      pagination: {
        currentPage: pageNum,
        totalItems: total,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
      data: notifications,
    });

  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID format.",
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      deleted: { $ne: true },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: notification,
    });

  } catch (err) {
    console.error("getNotificationById Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching notification.",
      error: err.message,
    });
  }
};

const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const notification = await Notification.findByIdAndUpdate(id, updateData, { new: true });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    res.status(200).json({ message: 'Notification updated', notification });
  } catch (err) {
    console.error('Error updating notification:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const deleteNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { deleted: true }, { new: true });

    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    res.status(200).json({ message: 'Notification soft-deleted', notification });
  } catch (err) {
    console.error('Error deleting notification:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteManyNotifications = async (req, res) => {
  try {
    const { ids } = req.body;
    const { hard } = req.query;

    // Validate input
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Provide an array of notification IDs to delete",
      });
    }

    let result;

    if (hard === "true") {
      // Hard delete: remove from database
      result = await Notification.deleteMany({ _id: { $in: ids } });
      return res.status(200).json({
        message: `${result.deletedCount} notifications permanently deleted`,
        deletedIds: ids,
      });
    } else {
      // Soft delete: mark as deleted
      result = await Notification.updateMany(
        { _id: { $in: ids } },
        { $set: { deleted: true } }
      );
      return res.status(200).json({
        message: `${result.modifiedCount} notifications soft-deleted`,
        softDeletedIds: ids,
      });
    }
  } catch (err) {
    console.error("Error deleting notifications:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

const deleteAllNotifications = async (req, res) => {
  try {
    const { hard } = req.query;

    if (hard === "true") {
      const result = await Notification.deleteMany({});
      return res.status(200).json({
        message: `${result.deletedCount} notifications permanently deleted`,
      });
    }

    const result = await Notification.updateMany(
      {},
      { $set: { deleted: true } }
    );

    return res.status(200).json({
      message: `${result.modifiedCount} notifications soft-deleted`,
    });
  } catch (err) {
    console.error("Error deleting notifications:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};



module.exports = {
  sendMeetingReminder,
  sendNotificationEmail,
  sendOrderConfirmationEmail,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotificationById,
  deleteManyNotifications,
  deleteAllNotifications,
};

