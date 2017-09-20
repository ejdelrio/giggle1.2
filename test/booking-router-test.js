const mongoose = require('mongoose');
const expect = require('chai').expect;
const request = require('superagent');
const helper = require('./lib/hooks.js');
const clearAll = helper.clearAll;
const authenticateUser = helper.authenticateUser;
const storeModel = helper.storeModel;
const templates = require('./lib/templates.js');
const url = templates.url;
const bookingRouter = require('../route/profile/booking-route.js');

require('../server.js')
const User = require('../model/user.js');
const Profile = require('../model/profile.js');
const Band = require('../model/profile')
const Booking = require('../model/profile/booking.js');

describe('Booking Routes', function () {
  after(done => {
    clearAll()
      .then(() => done())
      .catch(err => done(err));
  });

  describe('GET /api/booking', () => {
    describe('when provided a valid booking', () => {
      before((done) => {
        authenticateUser('userOne')
          .then(user => {
            templates.profileBand.userID = user._id;
            return storeModel(Profile, 'profileBand', 'userOne')
              .catch(err => console.log(err));
          })
          .then(profileBand => {
            console.log('made profileBand', profileBand);
            templates.bookingBand.bandName = profileBand.userName;
            console.log('\nupdates bookingBand with bandName', templates.bookingBand);
            return authenticateUser('userTwo')
          })
          .then((user) => {
            templates.profileVenue.userID = user._id;
            return storeModel(Profile, 'profileVenue', 'userTwo');
          })
          .then((profileVenue) => {
            console.log('made profileVenue', profileVenue);
            templates.bookingBand.venueName = profileVenue.userName;
            console.log('\nupdated bookingBand with venueName', templates.bookingBand);
            return storeModel(Booking, 'bookingBand', 'userOne');
          })
          .then((booking) => {
            console.log('fucking booking', booking)
            done();
          })
        .catch(done);
    })
    it('should return bookings', (done) => {
      console.log('hooks', helper.tokens);
      let model = templates.userOne;
      request.get(`${url}/api/booking`)
        .set('Authorization', `Bearer ${helper.tokens.userOne}`)
        .end((err, res) => {
          if (err) console.error(err);
          let {booking} = res.body;
          expect(res.status).to.equal(200);
          console.log('damnit eddie', res.body);
          res.body.forEach(function(result) {
            expect(result.bandName).to.equal(templates.profileBand.userName);
            expect(result.venueName).to.equal(templates.profileVenue.userName);
          })
          done();
        })
    })
  });
});
});