const Router = require('express').Router;
const debug = require('debug')('giggle:booking-route');
const Booking = require('../../model/profile/booking.js');
const bearerAuth = require('../../lib/bearer.js');
const profileFetch = require('../../lib/profileFetch.js');
const basicAuth = require('../../lib/basic.js');

const bookingRouter = module.exports = new Router();


bookingRouter.get('/api/booking', bearerAuth, profileFetch, function(req, res, next) {
  debug('GET /api/booking');

  let {type, userName} = req.profile;
  let name = (type === 'band') ? {bandName: userName} : {venueName: userName};
  
  Booking.find(name)
  .populate('bookingNotifications')
  .then((category) => {
    console.log('__BOOKING__', category);
    res.json(category);
  })
  .catch((err) => {
    console.error(err);
    next(err);
  })

  
});
