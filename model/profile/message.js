'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('giggle: Message Model');

const messageSchema = new Schema({
  senderID: {type: Schema.Types.ObjectId, ref: 'user', required: true},
  convoId: {type: Schema.Types.ObjectId, ref: 'convo', required: true},
  content: {type: String, required: true},
  dateSent: {type: Date, default: Date.now}
});

const Message = module.exports = mongoose.model('message', messageSchema);
