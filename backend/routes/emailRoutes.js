const express = require("express");
const router = express.Router();

const {
  sendMeetingReminder,
  sendNotificationEmail,
  sendOrderConfirmationEmail,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotificationById,
  deleteManyNotifications,
  deleteAllNotifications,
} = require("../controllers/emailController");

const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/send-reminder", authMiddleware, sendMeetingReminder);
router.post("/send-login-notif", authMiddleware, sendNotificationEmail);
router.post("/send-order-conf", authMiddleware, sendOrderConfirmationEmail);

router.get("/get-all", authMiddleware, getNotifications);
router.get("/get-one/:id", authMiddleware, getNotificationById);
router.put("/update/:id", authMiddleware, updateNotification);
router.delete("/del-all", authMiddleware, deleteAllNotifications);
router.delete("/del-by-id/:id", authMiddleware, deleteNotificationById);
router.delete("/del-many", authMiddleware, deleteManyNotifications )

module.exports = router;
