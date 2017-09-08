'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('giggle: Location Model');

const locationSchema = new Schema({
  profileID: {type: Schema.Types.ObjectId, required: true, unique: true, ref: 'profile'},
  loc: {type: [Number], index: '2d'},
  lastUpdated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('location', locationSchema);
