'use strict';

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

templates.url = `localhost:${process.env.PORT}`;
