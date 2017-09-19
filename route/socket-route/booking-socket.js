'use strict';

const debug = require('debug')('giggle: Booking Socket');
const createError = require('http-errors');

const Booking = require('../../model/profile/booking.js');
const BookingNote = require('../../model/profile/booking-notification.js');

const bookingSocket = module.exports = (socket, io) => {

  socket.on('requestBooking', bookingObj => {
    debug('Request Booking Socket Event');

    bookingObj.coverCharge = parseInt(bookingObj.coverCharge);
    bookingObj.compensation = parseInt(bookingObj.compensation);

    console.log(bookingObj)
    let newNote =  new BookingNote();
    let newBooking = new Booking(bookingObj);
    newNote.bookingID = newBooking._id;
    newBooking.notifications.push(newNote._id);
    console.log(newBooking)
    newBooking.save()
    .then(booking => {
      console.log('Booking Saved');
      newNote.content = `${bookingObj.author} has requested a booking!`;
      newNote.save();
    })
    .then(() => {
      console.log('Notifiaction Saved');
      io.sockets.emit(`newBooking-${newBooking.venueName}`, newBooking);
      io.sockets.emit(`newBooking-${newBooking.bandName}`, newBooking);
      io.sockets.emit(`newNotification-${newBooking.venueName}`, newNote);
      io.sockets.emit(`newNotification-${newBooking.bandName}`, newNote);

    })
    .catch(err => createError(400, err));
  });

  socket.on('updateBooking', (bookingObj => {
    debug('Update Booking Socket Event');

    var newBooking;
    let newNote = new BookingNote({
      content: `${bookingObj.author} has updated the booking`
    });
    bookingObj.notifications.push(newNote._id);

    Booking.findByIdAndUpdate(bookingObj)
    .save()
    .then(booking => {
      newBooking = booking;
      newNote.bookingID = booking._id;
      io.sockets.emit(`updateBooking-${booking.venueName}`, booking);
      io.sockets.emit(`updateBooking-${booking.bandName}`, booking);
      return newNote.save();
    })
    .then(() => {
      io.sockets.emit(`newNotification-${newBooking.venueName}`, newNote);
      io.sockets.emit(`newNotification-${newBooking.bandName}`, newNote);
    })
    .catch(err => createError(400, err));
  }));
};
