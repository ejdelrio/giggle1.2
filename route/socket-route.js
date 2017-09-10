'use strict';

const socketio = require('socket.io');
const debug = require('debug')('giggle: Socket Router');
const Message = require('../model/profile/message.js');
const Conversation = require('../model/profile/conversation');

module.exports = server => {

  const websocket = socketio(server);

  websocket.on('connection', (socket) => {
    console.log('Connection Established', socket.id);


    socket.on('message', message => {
      debug('Message Emission');
      /*Recieves a message object through a socket emission
      The message is then emitted to the conversation ID.
      The client will create a matching socket.on whenever the
      conversations are rendered. The socket.on will update the state
      of the individual conversation. This will broadcast
      to all clients who's DB queries return the matching convo :D
      */
      new Message(message).save()
      .then(message => {
        socket.emit(`update-${message.convoID.toString()}`);
      });
    });


    socket.on('startConvo', (members, message) => {
      debug('startConvo Emission');
      let allProfileIDs = members.map(member => member._id);

      new Conversation({members: allProfileIDs}).save()
      .then(convo => {
        message.convoID = convo;
        return message.save();
      })
      .then(() => {
        members.forEach(profile => {
          socket.emit(`update-${profile.username}-convos`);
        });
      });
    });

    socket.on('requestBooking', (booking, user) => {
      debug('requestBooking emission');
    })

  });
};
