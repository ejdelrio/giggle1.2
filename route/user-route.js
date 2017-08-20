'use strict';

const Router = require('express').Router;
const debug = require('debug')('giggle: User Router');
const createError = require('http-errors');
const jasonParser = require('body-parser').json();

const User = require('../model/user');
const Account = require('../model/account/account.js');
const basicAuth = require('../lib/basic.js');

const userRouter = module.exports = new Router();

userRouter.post('/api/signup', jasonParser, function(req, res) {
  debug('POST /api/signup');

  let passWord = req.auth.passWord;
  delete req.auth.passWord;


});

userRouter.get('/api.login', basicAuth, function(req, res) {
  debug('GET /api/login');
});
