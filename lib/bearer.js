'use strict';

const jwt = require('jsonwebtoken');
const debug = require('debug')('giggle: bearer auth middleware');
const createError = require('http-errors');

module.exports = function(req, res, next, err) {
  debug('Bearer Auth');

  authHeader = req.headers.authorization;
  if(!authHeader) return next(createError(400, 'Header required'));
  
  base64 = authHeader.split('Bearer ')[1];
  if(!base64) return next(createError(400, 'Token Required'));

  jwt.verify(base64, process.env.APP_SECRET, (err, decoded) => {
    if(err) return next(createError(401, err.message));
    User.findOne({hash: decoded.token})
    .then(user => {
      res.user = user;
      next();
    })
    .catch(err => next(createError(401, err.message)));
  })
}