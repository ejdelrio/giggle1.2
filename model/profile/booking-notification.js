'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('giggle: Booking Notification Model');
const Schema = mongoose.Schema;

const bookingNotificationModel = new Schema({
  author: {type: String, required: true},
  date: {type: Date, default: Date.now},
  seenByVenue: {type: Boolean, default: false},
  seenByBand: {type: Boolean, default: false},
  content: {type: String, required: true},
  bookingID: {type: String, required: true}
});

const bookingNotification = module.exports = mongoose.model('bookingNotification', bookingNotificationModel);
