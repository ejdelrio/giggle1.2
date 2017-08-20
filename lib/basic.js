'use strict';

const createErrors = require('http-errors');
const debug = require('debug')('giggle:basic auth middleware');

module.exports = function(req, res, next) {
  debug('basic auth');

  var authHeader = req.headers.authorization;

  if(!authHeader) return next(createErrors(400, 'Header required.'));

  var base64 = authHeader.split('Basic ')[1];
  if(!base64) return next(createErrors(400, 'Username and Password Required'));

  var utf = new Buffer(base64, 'base64').toString();
  var credentials = utf.split(':');

  req.auth = {
    userName: credentials[0],
    passWord: credentials[1]
  };
  if(!req.auth.userName) return next(createErrors(400, 'Username Required'));
  if(!req.auth.passWord) return next(createErrors(400, 'Password Required'));

  next();
};
