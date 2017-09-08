'use strict';

const request = require('superagent');
const expect = require('chai').expect;

const hooks = require('./lib/hooks.js');
const authenticateUser = hooks.authenticateUser;
const storeModel = hooks.storeModel;
const clearAll = hooks.clearAll;

const templates = require('./lib/templates.js');
const url = templates.url;
require('../server.js');

const User = require('../model/user.js');

describe('User Route tests', function() {
  describe('POST /api/signup', function() {

    after(done => {
      clearAll()
      .then(() => done())
      .catch(err => done(err));
    });

    describe('With a valid body', function() {
      it('Should return a user token and 200 code', done => {
        request.post(`${url}/api/signup`)
        .send(templates.userOne)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('string'); 
          done();
        });
      });
    });

    describe('With no body', function() {
      it('Should return a 400 err code', done => {
        request.post(`${url}/api/signup`)
        .end(err => {
          expect(err.status).to.equal(400);
          done();
        });
      });
    });

    describe('With an invalid body', function() {
      it('Should return a 400 err code', done => {
        request.post(`${url}/api/signup`)
        .send({wont:'work'})
        .end(err => {
          expect(err.status).to.equal(400);
          done();
        });
      });
    });
  });

  describe('GET /api/login', function() {
    before(done => {
      authenticateUser('userOne')
      .then(() => done())
      .catch(err => done(err));
    });

    after(done => {
      clearAll()
      .then(() => done())
      .catch(err => done(err));
    });

    describe('With a valid authentication header', function() {
      it('Should return a signed user token', done => {
        let model = templates.userOne;
        request(`${url}/api/login`)
        .auth(model.userName, model.passWord)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('string');
          done();
        });
      });
    });

    describe('With a valid authentication header', function() {
      it('Should return a signed user token', done => {
        request(`${url}/api/login`)
        .auth('wrong', 'wrong')
        .end(err => {
          expect(err.status).to.equal(401);
          done();
        });
      });
    });
  });
});
