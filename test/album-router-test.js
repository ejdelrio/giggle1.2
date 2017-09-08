'use strict';

const expect = require('chai').expect;
const request = require('superagent');

const hooks = require('./lib/hooks.js');
const {authenticateUser, storeModel, clearAll} = hooks;

const templates = require('./lib/templates.js');
const url = templates.url;
require('../server.js');

const Album = require('../model/profile/album');

describe('Album Router Test', function() {
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

  describe('POST /api/album', () => {
    describe('With a valid auth and req.body', () => {
      it('Should return a 200 code and album', done => {
        request.post(`${url}/api/album`)
        .set('Authorization', `Bearer ${hooks.tokens.userOne}`)
        .send(templates.album)
        .end((err, res) => {
          if(err) return done(err);
          let profile = hooks.profiles.userOne;
          expect(res.body.profileID).to.equal(profile._id.toString());
          expect(res.body.title).to.equal(templates.album.title);
          expect(res.body.genre).to.equal(templates.album.genre);
          done();
        });
      });
    });
  });
});
