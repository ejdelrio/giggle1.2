'use strict';

const Router = require('express').Router;
const debug = require('debug')('giggle: User Router');
const createError = require('http-errors');
const jasonParser = require('body-parser').json();
const superagent = require('superagent');

const User = require('../model/user.js');
const basicAuth = require('../lib/basic.js');

const userRouter = module.exports = new Router();


userRouter.get('/oauth/google/code', (req, res, next) => {
  if (!req.query.code) {
    res.redirect(process.env.CLIENT_URL);
  } else {
    superagent.post('https://www.googleapis.com/oauth2/v4/token')
    .type('form')
    .send({
      code: req.query.code,
      grant_type: 'authorization_code',
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.API_URL}/oauth/google/code`
    })
    .then(response => {
      console.log('POST: oauth2/v4/token', response.body);
      return superagent.get('https://www.googleapis.com/plus/v1/people/me/openIdConnect')
      .set('Authorization', `Bearer ${response.body.access_token}`)
    })
    .then(response => {
      console.log('GET: /people/me/openIdConnect', response.body);
      console.log('response body', response.body)
      return User.handleOAUTH(response.body);
    })
    .then(user => user.tokenCreate())
    .then( token => {
      console.log('my oauth token:', token);
      res.cookie('Giggle-Token', token);
      res.redirect(process.env.CLIENT_URL);
    })
    .catch((error) => {
      console.error(error);
      res.redirect(process.env.CLIENT_URL);
    })
  }
})

userRouter.post('/api/signup', jasonParser, function(req, res, next) {
  debug('POST /api/signup');

  if(!req.body.userName) return next(createError(400, 'Username required'));
  if(!req.body.passWord) return next(createError(400, 'Password required'));

  let passWord = req.body.passWord;
  delete req.body.passWord;

  let newUser = new User(req.body);
  newUser.encryptPassword(passWord)
  .then(user => user.save())
  .then(user => user.generateToken())
  .then(token => {
    res.json(token);
  })
  .catch(err => next(createError(400, err.message)));

});

userRouter.get('/api/login', basicAuth, function(req, res, next) {
  debug('GET /api/login');

  let passWord = req.auth.passWord;
  delete req.auth.passWord;

  User.findOne(req.auth)
  .then(user => user.attemptLogin(passWord))
  .then(user => user.generateToken())
  .then(token => {
    res.cookie('Giggle-Token', token, {maxAge: 86400});
    res.json(token);
  })
  .catch(err => next(createError(401, err.message)));
});
