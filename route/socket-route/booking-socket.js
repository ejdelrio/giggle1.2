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


    let newNote =  new BookingNote();
    let newBooking = new Booking(bookingObj);
    newNote.bookingID = newBooking._id;
    newBooking.notifications.push(newNote._id);

    newBooking.save()
    .then(() => {
      newNote.content = `${bookingObj.author} has requested a booking!`;
      newNote.save();
    })
    .then(() => {
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
    bookingObj.bandConfirm = false;
    bookingObj.venueConfirm = false;

    Booking.findByIdAndUpdate(bookingObj._id, bookingObj, {new: true})
    .then(booking => {
      newNote.bookingID = booking._id;
      io.sockets.emit(`updateBooking-${booking.venueName}`, bookingObj);
      io.sockets.emit(`updateBooking-${booking.bandName}`, bookingObj);
      return newNote.save();
    })
    .then(() => {
      io.sockets.emit(`newNotification-${newBooking.venueName}`, newNote);
      io.sockets.emit(`newNotification-${newBooking.bandName}`, newNote);
    })
    .catch(err => createError(400, err));
  }));


  socket.on('confirmBooking', (bookingObj => {
    debug('Confirm Booking Socket Event');

    var newBooking;
    let newNote = new BookingNote({
      content: `${bookingObj.author} has confirmed your booking`
    });
    bookingObj.notifications.push(newNote._id);

    Booking.findByIdAndUpdate(bookingObj._id, bookingObj, {new: true})
    .then(booking => {
      newNote.bookingID = booking._id;
      io.sockets.emit(`updateBooking-${booking.venueName}`, bookingObj);
      io.sockets.emit(`updateBooking-${booking.bandName}`, bookingObj);
      return newNote.save();
    })
    .then(() => {
      io.sockets.emit(`newNotification-${newBooking.venueName}`, newNote);
      io.sockets.emit(`newNotification-${newBooking.bandName}`, newNote);
    })
    .catch(err => createError(400, err));
  }));
};
