const Router = require('express').Router;
const debug = require('debug')('giggle:booking-route');
const Booking = require('../../model/profile/booking.js');

const bearerAuth = require('../../lib/bearer.js');
const profileFetch = require('../../lib/profileFetch.js');
const basicAuth = require('../../lib/basic.js');
const Profile = require('../../model/profile.js');

const bookingRouter = module.exports = new Router();


bookingRouter.get('/api/booking', bearerAuth, profileFetch, function(req, res, next) {
  debug('GET /api/booking');

  let {type, userName} = req.profile;
  let name = (type === 'band') ? {bandName: userName} : {venueName: userName};

  Booking.find(name)
  .populate('booking-notification')
  .then((bookingResults) => {
    console.log(bookingResults);
    res.json(bookingResults);
  })
  .catch((err) => {
    console.error(err);
    next(err);
  });
});

bookingRouter.get('/api/booking/:userName', function(req, res, next) {
  debug('GET /api/booking');

  let {userName} = req.params;

  Profile.findOne({userName})

  .then(profile => {
    let queryType = `${profile.type}Name`;
    return Booking.findOne({[queryType]: profile.userName});
  })
  .populate('booking-notification')
  .then((bookingResults) => {
    res.json(bookingResults);
  })
  .catch((err) => {
    console.error(err);
    next(err);
  });
});
