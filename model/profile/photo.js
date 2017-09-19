'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('giggle: Photo Schema');


const photoSchema = new Schema({
  profileID: {type: Schema.Types.ObjectId, required: false}, //added later
  url: {type: String, required: true},
  awsKey: {type: String, required: false},
  awsURI: {type: String, required: false}
});


const Photo = module.exports = mongoose.model('photo', photoSchema);
