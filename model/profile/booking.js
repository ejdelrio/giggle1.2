'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('giggle: Booking Model');
const Schema = mongoose.Schema;

const bookingModel = new Schema({
  venueID: {type: Schema.Types.ObjectId, required: true},
  bandID: {type: Schema.Types.ObjectId, required: true},
  date: {type: Date, required: true},
  venueName: {type: String, required: true},
  bandName: {type: String, required:true},
  coverCharge: {type: Number, default: 0},
  compensation: {type: Number, default: 0},
  description: {type: String, required: false},
  coords: [{type: Number, index: '2d'}],
  showImage: {type: String, required: false},
  notifications: [{type: Schema.Types.ObjectId, ref: 'bookingNotification'}]
});

const Booking = module.exports = mongoose.model('booking', bookingModel);
