'use strict';

const Router = require('express').Router;
const debug = require('debug')('giggle: User Router');
const createError = require('http-errors');
const jsonParser = require('body-parser').json();

const Profile = require('../model/profile.js');
const bearerAuth = require('../lib/bearer.js');
const profileFetch = require('../lib/profileFetch.js');

const profileRouter = module.exports = new Router();

profileRouter.post('/api/profile', jsonParser, bearerAuth, function(req, res, next) {
  debug('POST /api/profile');

  req.body.userID = req.user._id;
  req.body.userName = req.user.userName;

  new Profile(req.body).save()
  .then(profile => res.json(profile))
  .catch(err => next(createError(400, err.message)));

});

profileRouter.get('/api/profile', bearerAuth, profileFetch, function(req, res, next) {
  debug('GET /api/profile');

  res.json(req.profile);
  next();
});

profileRouter.get('/api/userQuery/:max/:limit', jsonParser, bearerAuth, profileFetch, function(req, res, next) {
  debug('GET /api/userQuery/:max/:limit'); //Test to see if radial searches work;

  //the limit parameter dictates how many items we'll pull per query
  //max represents max distance from the users location.
  let maxDistance = req.params.max/1000;
  let coords = req.profile.location;
  let limit = parseInt(req.params.limit);
  let locationQuery = {
    location: {
      $near: coords,
      $maxDistance: maxDistance,
      $minDistance: 0
    },
    genre: ['blues', 'metal']


  };

  Profile.find(locationQuery)
  .limit(limit).exec(function(err, result) {
    if(err) return next(createError(400, err.message));
    res.json(result);
  });
});

profileRouter.put('/api/profile', jsonParser, bearerAuth, profileFetch, function(req, res, next) {
  debug('PUT /api/profile');

  Profile.findByIdAndUpdate(req.profile._id, req.body, {new: true})
  .then(profile => res.json(profile))
  .catch(err => next(createError(404, err)));
});
