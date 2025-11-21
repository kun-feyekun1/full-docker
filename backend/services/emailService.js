'use strict';

require('dotenv').config();
const transporter = require('../config/mailerConfig');
const Notification = require('../mongoModels/Notification');
const emailMessageHTML = require('../utils/emailMessages/meetingReminder');
const orderConfEmail = require('../utils/emailMessages/orderConfirmation')

const sendNoticeEmailsForAll = async ({ userId } = {}) => {
  try {
    const friends = [
      // "abdulaziznuri495@gmail.com",
      //"arebumuha77@gmail.com"
      "mohammedhassen18291@gmail.com",
      // "abdurahmanethiopia@gmail.com",
    ];

    const sendPromises = friends.map(email => transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Project Notice Reminder",
      html: emailMessageHTML,
    }));

    const results = await Promise.all(sendPromises);

    const notification = new Notification({
      title: "Notice Reminder Sent",
      message: `Reminder emails sent to ${friends.length} recipients.\n\n${emailMessageHTML}`,
      type: 'general',
      emailSent: true,
      userId: userId || null,
    });

    await notification.save();

    console.log("All meeting emails sent successfully!");
    results.forEach((info, i) => {
      console.log(`Email to ${friends[i]}: ${info.response}`);
    });
    return { success: true, results };

  } catch (err) {
    console.error("Error sending meeting emails:", err);

    await Notification.create({
      title: "Failed to Send Meeting Emails",
      message: err.message,
      type: 'alert',
      emailSent: false,
      userId: userId || null,
    });
    
    return { success: false, error: err.message };
  }
};

// Custom Notification Email
const sendLoginNotificationEmail = async ({ to, subject, html, userId }) => {
  try {
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,

      html,
    });

    console.log("Notification email sent:", info.messageId);

    const notification = new Notification({
      title: subject,
      message: html,
      type: 'general',
      emailSent: true,
      userId,
    });

    await notification.save();

    return ({ message: "Notification email sent and saved", info: info.messageId, notification });

  } catch (err) {
    console.error("Error sending notification email:", err);

    await Notification.create({
      title: "Failed Notification Email",
      message: err.message,
      type: 'alert',
      emailSent: false,
      userId: userId || null,
    });

    return ({ message: "Failed to send notification email", error: err.message });
  }
};

// Order Confirmation Email
const sendOrderConfirmation = async ({ userEmail, userId, orderDetails }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Order Confirmation - Order #${orderDetails.id}`,
      html:orderConfEmail
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Order confirmation sent to ${userEmail}: ${info.messageId}`);

    const notification = new Notification({
      title: `Order Confirmation - Order #${orderDetails.id}`,
      message: `Your order totaling $${orderDetails.total} has been received.`,
      userId,
      type: 'order',
      emailSent: true,
    });

    await notification.save();
    return { success: true, info, notification };

  } catch (err) {
    console.error("Error sending order confirmation:", err);
    return { success: false, error: err.message };
  }
};

module.exports = {
  sendNoticeEmailsForAll,
  sendLoginNotificationEmail,
  sendOrderConfirmation,
};
