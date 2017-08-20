'use strict';

const express = require('express');
const debug = require('debug')('giggle:server.js');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;

const app = express();
const error = require('./lib/error.js');
const userRouter = require('./route/user-route.js');

dotenv.load();
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));
app.use(userRouter);
app.use(error);

app.listen(PORT, () => {
  debug('Server active on port: ', PORT);
});
