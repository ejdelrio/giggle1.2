'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('giggle: Message Model');

const messageSchema = new Schema({
  senderID: {type: Schema.Types.ObjectId, ref: 'user', required: true},
  convoId: {type: Schema.Types.ObjectId, ref: 'convo', required: true},
  content: {type: String, required: true}
});

const Message = mongoose.model('message', messageSchema);
