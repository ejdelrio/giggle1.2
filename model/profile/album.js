'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('giggle: Album Model');

const albumSchema = new Schema({
  profileID: {type: Schema.Types.ObjectId, required: true, ref: 'profile'},
  title: {type: String, required: true},
  genre: {type: String, required: true},
  datePublished: {type: Date, required: true, default: Date.now}
});

const Album = module.exports = mongoose.model('album', albumSchema);
