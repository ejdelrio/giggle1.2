const Router = require('express').Router;
const debug = require('debug')('giggle:booking-route');
const Booking = require('../../model/profile/booking.js');
const createError = require('http-errors');

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
  .populate('bookingNotification')
  .then((bookingResults) => {
    console.log(bookingResults);
    res.json(bookingResults);
  })
  .catch((err) => {
    console.error(err);
    next(createError(404, err));
  });
});

bookingRouter.get('/api/booking/:userName', function(req, res, next) {
  debug('GET /api/booking/:userName');

  let {userName} = req.params;

  Profile.findOne({userName})

  .then(profile => {
    let queryType = `${profile.type}Name`;
    return Booking.findOne({[queryType]: profile.userName});
  })
  .populate('bookingNotification')
  .then((bookingResults) => {
    res.json(bookingResults);
  })
  .catch((err) => {
    console.error(err);
    next(err);
  });
});

bookingRouter.get('/api/booking-query', function(req, res, next) {
  debug('GET /api/booking-query');

  let {maxDistance, location, startDate, limit} = req.query;

  let bookingQuery = {
    location: {
      $near: location,
      $maxDistance: maxDistance
    },
    venueConfirm: true,
    bandConfirm: true,
    date: new Date(startDate)
  };
  Booking.find(bookingQuery)
  .limit(parseInt(limit))
  .exec(function(err, result) {
    if(err) return next(createError(400, err.message));

    if(req.query.genres === '') return res.json(result);
    let genres = req.query.genres.split(' ');
    if(genres.length === 0) return res.json(result);
    console.log(result);
    console.log(genres);


    let genreHash = {};
    genres.forEach(val => {
      genreHash[val] = true;
    });
    console.log(genreHash);
    let newResult = result.filter(val => genreHash[val.genre]);
    res.json(newResult);
  })
  .catch(err => next(createError(404, err)));
});
