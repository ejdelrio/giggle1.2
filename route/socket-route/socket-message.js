'use strict';

const Conversation = require('../../model/profile/conversation');
const Message = require('../../model/profile/message.js');
const debug = require('debug')('giggle: Socket Message');
const createError = require('http-errors');

module.exports = (socket, io) => {

  socket.on('addMessagetoConvo', message => {
    debug('Message Emission');
    /*Recieves a message object through a socket emission
    The message is then emitted to the conversation ID.
    The client will create a matching socket.on whenever the
    conversations are rendered. The socket.on will update the state
    of the individual conversation. This will broadcast
    to all clients who's DB queries return the matching convo :D
    */
    let newMessage = new Message(message);

    Conversation.findBy({_id: message.convoID})
    .then(convo => {
      convo.messages.push(newMessage);
      return convo.messages.save();
    })
    .then(() => newMessage.save())
    .then(message => {
      io.sockets.emit(`update-convo-${message.convoID}`);
    })
    .catch(err => createError(400, err));
  });


  socket.on('startConvo', (data) => {
    debug('startConvo Emission');

    let newConvo = new Conversation({members: data.members});
    data.message.convoID = newConvo._id;
    newConvo.push(data.message);

    newConvo.save()
    .then(() => {
      return new Message(data.message).save();
    })
    .then(() => {
      data.members.forEach(userName => {
        console.log(`__EMITTING__: updateConvos-${userName}`);
        io.sockets.emit(`updateConvos-${userName}`, newConvo);
      });
    })
    .catch(err => createError(400, err));
  });
};
