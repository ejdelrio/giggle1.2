'use strict';

const socketio = require('socket.io');
const debug = require('debug')('giggle: Socket Router');
const Message = require('../../model/profile/message.js');
const Conversation = require('../../model/profile/conversation');
const socketMessage = require('./socket-message.js');

module.exports = server => {

  const websocket = socketio(server);

  websocket.on('connection', (socket) => {
    console.log('Connection Established', socket.id);

    socketMessage(socket);

    socket.on('balls-*', () => {
      console.log('it works!!');
    })

    socket.on('requestBooking', (booking, user) => {
      debug('requestBooking emission');


    });
  });
};
