'use strict';

const Router = require('express').Router;
const debug = require('debug')('giggle: Album route');
const createError = require('http-errors');
const jsonParser = require('body-parser').json();

const profileFetch = require('../../lib/profileFetch.js');
const bearerAuth = require('../../lib/bearer.js');
const Album = require('../../model/profile/album.js');

const albumRouter = module.exports = new Router();

albumRouter.post('/api/album', jsonParser, bearerAuth, profileFetch, function(req, res, next) {
  debug('POST /api/album');

  req.body.profileID = req.profile._id;

  new Album(req.body).save()
  .then(album => res.json(album))
  .catch(err => next(createError(400, err)));
});

albumRouter.get('/api/album/:profileID', function(req, res, next) {
  debug('GET /api/album/:profileID');

  Album.find({profileID: req.params.profileID})
  .then(albums => res.json(albums))
  .catch(err => next(createError(404, err)));
});

albumRouter.put('/api/album/:albumID', jsonParser, bearerAuth, profileFetch, function(req, res, next) {
  debug('PUT /api/album/:albumID');

  Album.findOneAndUpdate(
    {
      profileID: req.profile._id,
      _id: req.params.albumID
    },
    req.body,
    {new: true}
  )
  .then(album => res.json(album))
  .catch(err => next(createError(400, err)));
});

albumRouter.delete('/api/album/:albumID', jsonParser, bearerAuth, profileFetch, function(req, res, next) {
  debug('DELETE /api/album/:albumID');
  /*Need to research mongoose to find out how to find and DELETE
  children of the album. this includes tracks and shit like that :D */

});
