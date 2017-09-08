'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('giggle: profile model');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  userID: {type: Schema.Types.ObjectId, required: true, unique: true},
});

const Profile = module.exports = mongoose.model('profile', profileSchema);
