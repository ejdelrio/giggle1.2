'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('giggle: User Model');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {type: String, required: true, unique: true},
  passWord: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  hash: {type: String, unique: true},
  photos: [{type: Schema.Types.ObjectId, ref: 'photo'}],
  videos: [{type: Schema.Types.ObjectId, ref: 'video'}],
  bookings: [{type: Schema.Types.ObjectId, ref: 'booking'}],
  conversations: [{type: Schema.Types.ObjectId, ref: 'convo-node'}],
  location: {type: Schema.Types.ObjectId, ref: 'location', required: false}
});

userSchema.methods.encryptPassword = function(password) {
  debug('encryptPassword');

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, cryptedPass) => {
      if(err) return reject(err);
      this.passWord = cryptedPass;
      resolve(this);
    });
  });
};

userSchema.methods.attemptLogin = function(password) {
  debug('attemptLogin');

  return new Promise((resolve, reject) => {
    console.log(this);
    bcrypt.compare(password, this.passWord, (err, valid) => {
      if(err) reject(err);
      if(!valid) return reject(createError(401, 'Unauthorized'));
      resolve(this);
    });
  });
};

userSchema.methods.generateHash = function() {
  debug('generateHash');

  return new Promise((resolve, reject) => {
    let tries = 0;

    _generateHash.call(this);

    function _generateHash() {
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
      .then( () => resolve(this.findHash))
      .catch( err => {
        if ( tries > 3) return reject(err);
        tries++;
        return _generateHash.call(this);
      });
    }
  });
};

userSchema.methods.generateToken = function() {
  debug('generateToken');

  return new Promise((resolve, reject) => {
    this.generateHash()
    .then( findHash => resolve(jwt.sign({ token: findHash }, process.env.APP_SECRET)))
    .catch( err => reject(err));
  });
};

module.exports = mongoose.model('user', userSchema);
