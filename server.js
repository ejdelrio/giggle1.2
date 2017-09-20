'use strict';

const express = require('express');
const debug = require('debug')('giggle:server.js');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const socketio = require('socket.io');
const PORT = process.env.PORT || 3000;


const app = express();
const server = http.Server(app);
const error = require('./lib/error.js');

const photoRouter = require('./route/profile/photo-route.js');
const trackRouter = require('./route/profile/track-route.js');
const userRouter = require('./route/user-route.js');
const albumRouter = require('./route/profile/album-route.js');
const socketRouter = require('./route/socket-route/socket-route.js');
const profileRouter = require('./route/profile-route.js');
const convoRouter = require('./route/profile/convo-route.js');
const bookingRouter = require('./route/profile/booking-route.js');

dotenv.load();
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));
app.use(userRouter);
app.use(albumRouter);
app.use(trackRouter);
app.use(photoRouter);
app.use(profileRouter);
app.use(convoRouter);
app.use(bookingRouter);
app.use(error);

socketRouter(server);

server.listen(PORT, () => {
  debug('Server active on port: ', PORT);
});
