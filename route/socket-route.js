'use strict';

const socketio = require('socket.io');
const debug = require('debug')('giggle: Socket Router');
const Message = require('../model/profile/message.js');
const Conversation = require('../model/profile/conversation');

module.exports = server => {

  const websocket = socketio(server);

  websocket.on('connection', (socket) => {
    console.log('A client just joined on', socket.id);

    socket.on('message', message => {
      console.log('MESSAGE: ', message);

    });
  });
};
