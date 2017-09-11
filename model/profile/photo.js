'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('giggle: Photo Schema');


const photoSchema = new Schema({
  profileID: {type: Schema.Types.ObjectId, required: true},
  url: {type: String, required: true},
  awsKey: {type: String, required: true},
  awsURI: {type: String, required: true}
});


const Photo = module.exports = mongoose.model('photo', photoSchema);
