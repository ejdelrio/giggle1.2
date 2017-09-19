const bookingRouter = module.exports = new Router();
const debug = require('debug')('giggle:booking-route');

bookingRouter.get('/api/booking', function(req, res, next) {
  debug('GET /api/booking');
  
  
});