'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('giggle: Booking Model');
const Schema = mongoose.Schema;

const bookingModel = new Schema({
  date: {type: Date, required: true},
  venueName: {type: String, required: true},
  bandName: {type: String, required:true},
  coverCharge: {type: Number, default: 0},
  compensation: {type: Number, default: 0},
  description: {type: String, required: false},
  location: [{type: Number, index: '2d'}],
  city: {type: String, required: true},
  state: {type: String, required: true},
  showImage: {type: String, required: false},
  bandConfirm: {type: Boolean, default: false},
  venueConfirm: {type: Boolean, default: false},
  notifications: [{type: Schema.Types.ObjectId, ref: 'bookingNotification'}]
});

const Booking = module.exports = mongoose.model('booking', bookingModel);
