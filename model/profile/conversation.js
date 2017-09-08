'use strict';

const debug = require('debug')('giggle: Convo Model')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const convoSchema = new Schema({
  members: [{type: Schema.Types.ObjectId, ref: 'user'}],
});

const Convo = mongoose.model('convo', convoSchema);
