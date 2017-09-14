'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('giggle: profile model');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  userID: {type: Schema.Types.ObjectId, required: true, unique: true},
  userName: {type: String, unique: true, required: true},
  type: {type: String, required: true, unique: false},
  avatar: {type: String, required: false, unique: false},
  bio: {type: String, required: true, unique: false},
  genre: [{type: String}],
  conversations: [{type: Schema.Types.ObjectId, ref: 'convo'}],
  albums: [{type: Schema.Types.ObjectId, ref: 'album'}],
  members: [{type: Schema.Types.ObjectId, ref: 'member'}],
  photos: [{type: Schema.Types.ObjectId, ref: 'photo'}],
  videos: [{type: Schema.Types.ObjectId, ref: 'video'}],
  location: [{type: Number, ref: 'location', index: '2d'}]
});

const Profile = module.exports = mongoose.model('profile', profileSchema);
