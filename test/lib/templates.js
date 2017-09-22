'use strict';

const path = require('path');

const templates = module.exports = {};

templates.userOne = {
  userName: 'steve_jobs',
  email: 'windowsCanSuckIt@apple.com',
  passWord: 'googleCanSuckItTo',
};

templates.userTwo = {
  userName: 'bill_gates',
  passWord: 'richerThanYou',
  email: 'godOfMicroSoft@microsoft.com',
};

templates.userThree = {
  userName: 'bernie_sanders',
  passWord: 'vermont4Life',
  email: 'turtle@turtle.com'
};

templates.album = {
  title: 'Butt Juice',
  genre: 'Metal'
};

templates.track = {
  title: 'Happy Christmas Songs',
  url: 'http://localhost:1234',
  soundFile: path.resolve(__dirname, '../../route/data-mp3s/test.mp3')
};

templates.profileOne = {
  userName: 'f**kboi',
  type: 'band',
  city: 'kitty city',
  state: 'pleasantville',
  bio: 'i love puppies',
}

templates.photo = {
  title: 'parser photo',
  url: 'http://localhost:1234',
  imageFile: path.resolve(__dirname, '../../route/data-photos/parser.jpg')
}

templates.url = `localhost:${process.env.PORT}`;
