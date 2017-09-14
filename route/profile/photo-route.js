'use strict';

const fs = require('fs');
const path = require('path');
const del = require('del');
const AWS = require('aws-sdk');
const multer = require('multer');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('giggle:track-route');

const Photo = require('../../model/profile/photo.js');
const bearerAuth = require('../../lib/bearer.js');
const profileFetch = require('../../lib/profileFetch.js');

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();
const dataDir = `${__dirname}/../data`;
const upload = multer({ dest: dataDir });

const photoRouter = module.exports = Router();
var photoKey = '';

function s3uploadProm(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, s3data) => {
      if(err) reject(err);
      resolve(s3data);
    });
  });
}

photoRouter.post('/api/photo', bearerAuth, profileFetch, upload.single('imageFile'), function (req, res, next) {
  debug('POST: /api/photo');

  if (!req.file) return next(createError(400, 'file not found'));

  if (!req.file.path) return next(createError(500, 'file not saved'));


  let ext = path.extname(req.file.originalname);

  let params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET,
    Key: `${req.file.filename}${ext}`,
    Body: fs.createReadStream(req.file.path)
  };
  req.body.profileID = req.user.profile._id;


  s3uploadProm(params)
  .then(s3data => {
    let photoKey = s3data.key;
    del([`${dataDir}/*`]);
    let photoData = {
      url: req.body.url,
      profileID: req.body.profileID,
      awsKey: photoKey,
      awsURI: s3data.location
    };
    return new Photo(photoData).save();
  })
  .then(track => {
    console.log('CREATED THE TRACK!', track);
    res.json(track);
  })
  .catch(err => next(createError(404, err.message)));

});

photoRouter.delete('/api/photo/:id', bearerAuth, profileFetch, function (req, res, done) {
  console.log(req.body);
  var params = {
    Bucket: process.env.AWS_BUCKET,
    Key: `${photoKey}`
  };

  function s3deleteProm(params) {
    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (err, s3data) => {
        if (err) reject(err);
        resolve(s3data);
      });
    });
  }

  Photo.findByIdAndRemove(`${req.params._id}`)
  .then(() => s3deleteProm(params))
  .then(() => console.log('deleted ', params.Key))
  .then(() => {
    res.send(204);
    done();
  })
  .catch((err) => {
    done(err);
  });
});
