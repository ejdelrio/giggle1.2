'use strict';

const Router = require('express').Router;
const debug = require('debug')('giggle: Album route');
const createError = require('http-errors');
const jsonParser = require('body-parser').json();

const profileFetch = require('../../lib/profileFetch.js');
const bearerAuth = require('../../lib/bearer.js');
const Album = require('../../model/profile/album.js');

const albumRouter = new Router();

albumRouter.post('/api/album', jsonParser, bearerAuth, profileFetch, function(req, res, next) {
  debug('POST /api/album');

  req.body.profileID = req.profile._id;

  new Album(req.body).save()
  .then(album => res.json(album))
  .catch(err => next(createError(400, err)));
});
