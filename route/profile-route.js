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
  req.body.avatar = 'http://lh5.ggpht.com/_S0f-AWxKVdM/S5TprpHWsZI/AAAAAAAAL6c/QWXlAX3IGgQ/d_silhouette_horn_hand%5B2%5D.jpg?imgmax=800';

  new Profile(req.body).save()
  .then(profile => res.json(profile))
  .catch(err => next(createError(400, err.message)));

});

profileRouter.get('/api/profile', bearerAuth, profileFetch, function(req, res, next) {
  debug('GET /api/profile');

  res.json(req.profile);
  next();
});

profileRouter.get('/api/profile/:userName', function(req, res, next) {
  debug('GET /api/profile');

  Profile.findOne({userName: req.params.userName})
  .then(profile => res.json(profile))
  .catch(err => next(createError(404, err)));
});

profileRouter.get('/api/userQuery/', bearerAuth, profileFetch, function(req, res, next) {
  debug('GET /api/userQuery/'); //Test to see if radial searches work;
  //the limit parameter dictates how many items we'll pull per query
  //max represents max distance from the users location.
  let maxDistance = parseInt(req.query.maxDistance)/100;
  let coords = req.query.location;
  let limit = parseInt(req.query.limit);

  let locationQuery = {
    location: {
      $near: coords,
      $maxDistance: maxDistance
    },
    type: req.query.type
  };

  Profile.find(locationQuery)
  .limit(limit)
  .exec(function(err, result) {
    if(err) return next(createError(400, err.message));
    let genres = req.query.genres;
    if(genres === '') return res.json(result);


    let genreHashMap = {};
    let newResult = [];

    genres.split(' ').forEach(val => {
      genreHashMap[val] = true;
    });

    result.forEach(val => {
      for (let i = 0; i < val.genre.length; i++) {

        if(genreHashMap[val.genre[i]]) {
          newResult.push(val);
          break;
        }
      }
    });
    res.json(newResult);
  })
  .catch(err => next(createError(404, err)));
});

profileRouter.put('/api/profile', jsonParser, bearerAuth, profileFetch, function(req, res, next) {
  debug('PUT /api/profile');

  Profile.findByIdAndUpdate(req.profile._id, req.body, {new: true})
  .then(profile => res.json(profile))
  .catch(err => next(createError(404, err)));
});
