
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
const User = require('../model/user.js');
const Profile = require('../model/profile.js');
const Photo = require('../model/profile/photo.js');

var deleteToken = '';
describe('Photo Routes', function () {
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

  describe('POST /api/photo', () => {
    describe('when provided a valid photo', () => {
      before((done) => {
        authenticateUser('userOne')
          .then(user => {
            templates.photo.userID = user._id;
            return storeModel(Profile, 'profileBand', 'userOne')
              .catch(err => console.log(err));
          })
          .then(profile => {
            templates.photo.profileID = profile._id;
            deleteToken = helper.tokens.userOne;
            console.log('top level delete token set to: ', deleteToken);

            return storeModel(Photo, 'photo', 'userOne')
              .catch(err => console.log(err));
          })
          .then(photo => {
            done();
          })
          .catch(done);
      })
      it('responds with a photo', (done) => {
        console.log('helper', helper);
        request.post(`${url}/api/photo`)
          .set({
            Authorization: `Bearer ${helper.tokens.userOne}`
          })
          .field('title', templates.photo.title)
          .field('url', templates.photo.url)
          .attach('imageFile', templates.photo.imageFile)
          .end((err, res) => {
            console.log('resbody', res.body);
            if (err) return done(err);
            expect(res.status).to.equal(200);
            expect(res.body.url).to.equal(templates.photo.url);;
            //TODO: fix bug
            expect(res.body.profileID).to.equal(templates.photo.profileID.toString());
            done();
          });
      });
    });
  });

  describe('DELETE /api/photo/:photoID', function () {
    describe('when given a valid id and token', function () {
      it('deletes the item from the db and aws', (done) => {
        request.delete(`${url}/api/photo/${helper.models.photo._id}`)
          .set({ Authorization: `Bearer ${deleteToken}` })
          .end((err, rsp) => {
            expect(rsp.status).to.equal(204);
            done();
          })
      })
    })
  })
});