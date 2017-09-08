'use strict';

const Profile = require('../model/profile.js');
const debug = require('debug')('giggle: profile Fetch middleware');
const createError = require('http-errors');

module.exports = function(req, res, next) {
  debug('profileFetch');

  if(!req.user._id) next(createError(400, 'User required'));

  Profile.findOne({userID: req.user._id})
  .then(profile => {
    req.profile = profile;
    next();
  })
  .catch(err => next(createError(404, err)));
};
