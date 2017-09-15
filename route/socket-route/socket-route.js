'use strict';

const socketio = require('socket.io');
const debug = require('debug')('giggle: Socket Router');
const Message = require('../../model/profile/message.js');
const Conversation = require('../../model/profile/conversation');
const socketMessage = require('./socket-message.js');

module.exports = server => {

  const websocket = socketio(server);
  // let chat = websocket.of('/chat');


  websocket.on('connection', (socket) => {
    console.log('__SOCKET_CONNECTION__: ', socket.id);

    socket.on('test', profile => websocket.sockets.emit('testing', `${profile.userName} logged on`));

    socketMessage(socket, websocket);

  });
};
