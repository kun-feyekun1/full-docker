'use strict';

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: false
    },
    type: {
      type: String,
      enum: ['general', 'order', 'alert'],
      default: 'general'
    },
    emailSent: {
      type: Boolean,
      default: false
    }
  },
);

module.exports = mongoose.model('Notification', notificationSchema);
