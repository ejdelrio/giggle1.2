'use strict';

const Conversation = require('../../model/profile/conversation');
const Message = require('../../model/profile/message.js');
const debug = require('debug')('giggle: Socket Message');
const createError = require('http-errors');

module.exports = (socket, io) => {

  socket.on('addMessagetoConvo', message => {
    debug('Message Emission');

    let newMessage = new Message(message);
    var updatingConvo;

    Conversation.findOne({_id: message.convoID})
    .then(convo => {
      updatingConvo = convo;
      convo.messages.push(newMessage._id);
      console.log(convo);
      return convo.save();
    })
    .then(() => {
      console.log('bacon')
      return newMessage.save();
    })
    .then(message => {
      updatingConvo.members.forEach(userName => {
        console.log('__EMITTING_TO__:', `newMessage-${userName}`)
        io.sockets.emit(`newMessage-${userName}`, message);
      });
    })
    .catch(err => createError(400, err));
  });


  socket.on('startConvo', (data) => {
    debug('startConvo Emission');

    let newConvo = new Conversation({members: data.members});
    let newMessage = new Message(data.message);

    newMessage.convoID = newConvo._id;
    newConvo.messages.push(newMessage._id);

    newConvo.save()
    .then(() => {
      return newMessage.save();
    })
    .then(() => {
      data.members.forEach(userName => {
        console.log(`__EMITTING__: updateConvos-${userName}`);
        io.sockets.emit(`updateConvos-${userName}`, newConvo);
        io.sockets.emit(`newMessage-${userName}`, newMessage);
      });
    })
    .catch(err => createError(400, err));
  });
};
