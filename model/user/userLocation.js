'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('giggle: Location Model');

const locationSchema = new Schema({
  userID: {type: Schema.Types.ObjectId, required: true, unique: true},
  loc: {type: [Number], index: '2d'},
  lastupDated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Location', locationSchema);
