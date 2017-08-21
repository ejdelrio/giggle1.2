'use strict';

const Router = require('express').Router;
const debug = require('debug')('giggle: User Router');
const createError = require('http-errors');
const jasonParser = require('body-parser').json();

const User = require('../model/user');
const locSchema = require('../model/user/userLocation.js');
const basicAuth = require('../lib/basic.js');

const userRouter = module.exports = new Router();

userRouter.post('/api/signup', jasonParser, function(req, res, next) {
  debug('POST /api/signup');

  if(!req.body.userName) return next(createError(400, 'Username required'));
  if(!req.body.passWord) return next(createError(400, 'Password required'));

  let passWord = req.body.passWord;
  let coords = req.body.location;
  delete req.body.location;
  delete req.body.passWord;

  let newUser = new User(req.body);
  let userLocation = new locSchema({loc: coords, userID: newUser._id});
  newUser.location = userLocation._id;



  userLocation.save()
  .then(() => newUser.encryptPassword(passWord))
  .then(user => user.generateToken())
  .then(token => res.json(token))
  .catch(err => next(createError(400, err.message)));

});

userRouter.get('/api/login', basicAuth, function(req, res, next) {
  debug('GET /api/login');

  let passWord = req.auth.passWord;
  delete req.auth.passWord;

  User.findOne(req.auth)
  .populate('location')
  .then(user => user.attemptLogin(passWord))
  .then(user => user.generateToken())
  .then(token => res.json(token))
  .catch(err => next(createError(401, err.message)));
});
