const mongoose = require('mongoose');
const expect = require('chai').expect;
const request = require('superagent');
const helper = require('./lib/hooks.js');
const clearAll = helper.clearAll;
const authenticateUser = helper.authenticateUser;
const storeModel = helper.storeModel;
const templates = require('./lib/templates.js');
const url = templates.url;

require('../server.js')
const Album = require('../model/profile/album.js');
const User = require('../model/user.js');
const Profile = require('../model/profile.js');
const Track = require('../model/profile/track.js');

var deleteToken = '';
describe('Track Routes', function () {
  // before(done => {
    
  //   authenticateUser('user')
  //   .then(() => storeModel(Band, 'band', 'user'))
  //   .then(() => done())
  //   .catch(err => done(err))
  // });

  after(done => {
    clearAll()
    .then(() => done())
    .catch(err => done(err));
  });

  describe('POST /api/album/:id/track', () => {
    describe('when provided a valid track', () => {
      before((done) => {
        authenticateUser('userOne')
          .then(user => {
            templates.track.userID = user._id;
            return storeModel(Profile, 'profileBand', 'userOne')
              .catch(err => console.log(err));
          })
          .then(profile => {
            templates.album.profileID = profile._id;
            templates.track.profileID = profile._id;
            return storeModel(Album, 'album', 'userOne')
              .catch(err => console.log(err));
          })
          .then(album => {
            deleteToken = helper.tokens.userOne;
            console.log('top level delete token set to: ', deleteToken);
            templates.track.albumID = album._id;
            return storeModel(Track, 'track', 'userOne')
              .catch(err => console.log(err));
          })
          .then(track => {
            done();
          })
          .catch(done);
      })
      it('responds with a track', (done) => {
        console.log('helper', helper);
        request.post(`${url}/api/album/${helper.models.album._id}/track`)
          .set({
            Authorization: `Bearer ${helper.tokens.userOne}`
          })
          .field('title', templates.track.title)
          .field('url', templates.track.url)
          .attach('soundFile', templates.track.soundFile)
          .end((err, res) => {
            console.log('resbody', res.body);
            if (err) return done(err);
            expect(res.status).to.equal(200);
            expect(res.body.title).to.equal(templates.track.title);
            expect(res.body.url).to.equal(templates.track.url);
            expect(res.body.albumID).to.equal(templates.track.albumID.toString());
            //TODO: fix bug
            expect(res.body.profileID).to.equal(templates.track.profileID.toString());
            done();
          });
      });
    });
  });

  describe('DELETE /api/album/:albumID/track/:trackID', function () {
    describe('when given a valid id and token', function () {
      it('deletes the item from the db and aws', (done) => {
        request.delete(`${url}/api/album/${helper.models.album._id}/track/${helper.models.track._id}`)
          .set({ Authorization: `Bearer ${deleteToken}` })
          .end((err, rsp) => {
            expect(rsp.status).to.equal(204);
            done();
          })
      })
    })
  })
});