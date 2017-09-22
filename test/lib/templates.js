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

templates.profileBand = {
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

templates.profileVenue = {
  userName: 'the hobo triangle out front',
  type: 'venue',
  state: 'death valley',
  city: 'ca',
  bio: 'i eat vultures'
}

templates.bookingBand = {
  date: new Date(),
  description: 'every wonder what 100000 volts of electricity coursing through your body feels like?  about as good as this show you are about to see will make you feel.  remember to bring your id and your money because it is a small price to pay for the memory...(or lack of) this amazing show you have just booked.'
}

// date: {type: Date, required: true},
// venueName: {type: String, required: true},
// bandName: {type: String, required:true},
// coverCharge: {type: Number, default: 0},
// compensation: {type: Number, default: 0},
// description: {type: String, required: false},
// coords: [{type: Number, index: '2d'}],
// showImage: {type: String, required: false}

templates.url = `localhost:${process.env.PORT}`;
