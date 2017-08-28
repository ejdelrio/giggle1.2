'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('giggle: Album Model');

const albumSchema = new Schema({
  userID: {type: Schema.Types.ObjectId, required: true, ref: 'user'},
  title: {type: String, required: true},
  datePublished: {type: Date, required: true, default: Date.now}
});

const Album = mongoose.model('album', albumSchema);
