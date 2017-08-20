'use strict';

const express = require('express');
const debug = require('debug')('giggle:server.js');
const cors = require('cors');
const morgan = require('morgan');
const PORT = process.env.PORT || 3000;

const app = express();
const error = require('./lib/error.js');

app.use(cors());
app.use(morgan('dev'));
app.use(error);

app.listen(PORT, () => {
  debug('Server active on port: ', PORT);
});
