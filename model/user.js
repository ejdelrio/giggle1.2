'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('giggle: User Model');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Schema = mongoose.Schema;
const faker = require('faker');

const userSchema = new Schema({
  userName: { type: String, required: true, unique: true },
  passWord: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hash: { type: String, unique: true },
});

userSchema.methods.encryptPassword = function (password) {
  debug('encryptPassword');
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, cryptedPass) => {
      if (err) return reject(err);
      this.passWord = cryptedPass;
      resolve(this);
    });
  });
};

userSchema.methods.tokenCreate  = function(){
  debug('tokenCreate');

  this.tokenSeed = crypto.randomBytes(32).toString('base64')
  return this.save()
  .then(user => {
    return jwt.sign({tokenSeed: this.tokenSeed}, process.env.APP_SECRET)
  })
  .then(token => {
    return token
  })
}

userSchema.methods.attemptLogin = function (password) {
  debug('attemptLogin');

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.passWord, (err, valid) => {
      if (err) reject(err);
      if (!valid) return reject(createError(401, 'Unauthorized'));
      resolve(this);
    });
  });
};

userSchema.methods.generateHash = function () {
  debug('generateHash');

  return new Promise((resolve, reject) => {
    let tries = 0;

    _generateHash.call(this);

    function _generateHash() {
      this.hash = crypto.randomBytes(32).toString('hex');
      console.log(this);
      this.save()
        .then(() => {
          return resolve(this.hash);
        })
        .catch(err => {
          if (tries > 3) return reject(err);
          tries++;
          return _generateHash.call(this);
        });
    }
  });
};

userSchema.methods.generateToken = function () {
  debug('generateToken');

  return new Promise((resolve, reject) => {
    this.generateHash()
    .then(hash => resolve(jwt.sign({token: hash}, process.env.APP_SECRET)))
    .catch( err => reject(err));
  });
};

const User = mongoose.model('user', userSchema);

User.handleOAUTH = function (data) {
  if (!data || !data.email) {
    return Promise.reject(createError(400, 'VALIDATION ERROR - missing login info'));
  }

  return User.findOne({ email: data.email })
    .then(user => {
      if (!user) {
        return new User({
          userName: faker.internet.userName(),
          passWord: faker.internet.password(),
          email: data.email
        }).save();
      }
      return user;
    })
    .catch(() => {
      console.log('in catch block');
      // return new User({
      //   username: faker.internet.userName(),
      //   email: data.email
      // }).save();
    });
};

module.exports = User;
