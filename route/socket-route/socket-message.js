'use strict';

const Conversation = require('../../model/profile/conversation');
const Message = require('../../model/profile/message.js');
const debug = require('debug')('giggle: Socket Message');

module.exports = socket => {

  socket.on('addMessagetoConvo', message => {
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
      socket.emit(`update-convo-${message.convoID}`);
    })
    .catch(err => console.error(err));
  });

  socket.on('startConvo', (data) => {
    debug('startConvo Emission');

    new Conversation({members: data.members}).save()
    .then(convo => {
      data.message.convoID = convo;
      return new Message(data.message).save();
    })
    .then(() => {
      data.members.forEach(userName => {
        socket.emit(`updateConvos-${userName}`);
      });
    });
  });
};
