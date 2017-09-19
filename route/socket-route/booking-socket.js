'use strict';

const debug = require('debug')('giggle: Booking Socket');
const Booking = require('../../model/profile/booking.js');
const createError = require('http-erros');

const bookingSocket = module.exports = (socket, io) => {

  socket.on('requestBooking', bookingObj => {
    new Booking(bookingObj)
    .save()
    .then(booking => {
      io.sockets.emit(`newBooking-${booking.venueName}`);
      io.sockets.emit(`newBooking-${booking.bandName}`);
    })
    .catch(err => createError(400, err));
  });

  socket.on('updateBooking', bookingObj => {
    Booking.findByIdAndUpdate(bookingObj)
    .save()
    .then(booking => {
      io.sockets.emit(`updateBooking-${booking.venueName}`);
      io.sockets.emit(`updateBooking-${booking.bandName}`);
    })
    .catch(err => createError(400, err));
  });
};
