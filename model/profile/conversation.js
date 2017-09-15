'use strict';

const debug = require('debug')('giggle: Convo Model')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const convoSchema = new Schema({
  members: [{type: String, ref: 'user'}],
});

const Convo = module.exports = mongoose.model('convo', convoSchema);
