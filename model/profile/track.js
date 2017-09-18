'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trackSchema = new Schema({
  profileID: {type: Schema.Types.ObjectId, required: true},
  title: {type: String, required: true},
  albumID: {type: Schema.Types.ObjectId, required: true},
  url: {type: String, required: true},
  awsKey: {type: String, required: false},
  awsURI: {type: String, required: false} //these are added by aws upload
});

const Track = module.exports = mongoose.model('track', trackSchema);
