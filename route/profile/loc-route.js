'use strict';

const Router = require('express').Router;
const debug = require('debug')('giggle: Loc Router');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const Loc = require('../../model/profile/userLocation.js');
const bearerAuth = require('../../lib/bearer.js');

const locRouter = module.exports = new Router();

locRouter.put('/api/location', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT /api/location');

  Loc.findOndeAndUpdate({userID: req.user._id}, req.body, {new: true})
  .then(loc => res.json(loc))
  .catch(err => next(createError(404, err.message)));
});

locRouter.get('/api/location/:max/:limit', bearerAuth, function(req, res, next) {
  debug('GET /api/location'); //Test to see if radial searches work;

  //the limit parameter dictates how many items we'll pull per query
  //max represents max distance from the users location.
  let maxDistance = req.params.max /= 6371;
  let coords = req.user.location.loc;
  let limit = parseInt(req.params.limit);

  Loc.find({
    loc: {
      $near: coords,
      $maxDistance: 10,
      $minDistance: 0
    }
  }).limit(limit).exec(function(err, result) {
    if(err) return next(createError(400, err.message));
    res.json(result);
  });


});
