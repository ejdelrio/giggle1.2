'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('giggle: Conversation Router');

const bearerAuth = require('../../lib/bearer.js');
const profileFetch = require('../../lib/profileFetch.js');
const Conversation = require('../../model/conversation.js');

const convoRouter = module.exports = new Router();

convoRouter.get('/api/conversations', bearerAuth, profileFetch, function(req, res, next) {
  debug('GET /api/conversation');

  Conversation.find({members: req.profile._id})
  .then(convos => res.json(convos))
  .catch(err => next(createError(404, err)));
});
