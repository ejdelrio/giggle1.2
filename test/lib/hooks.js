'use strict';

const debug = require('debug')('giggle: Hook Module');
const User = require('../../model/user.js');
const Loc = require('../../model/user/userLocation.js');
const templates = require('./templates.js');

const hooks = module.exports = {};

hooks.users = {};
hooks.tokens = {};
hooks.models = {};
hooks.locations = {};

hooks.authenticateUser = function (templateName) {
  debug('authenticateUser');

  return new Promise((resolve, reject) => {

    let newUser = hooks.users[templateName] = new User(templates[templateName]);

    newUser.encryptPassword(newUser.passWord)
    .then(user => user.generateToken())
    .then(token => hooks.tokens[templateName] = token)
    .then(() => resolve(newUser))
    .catch(err => reject(err));
  });
};

hooks.storeModel = function(schemaName, templateName, userName, props) {
  debug('storeModel');

  return new Promise((resolve, reject) => {
    let newModel = hooks.models[templateName] = schemaName(templates[templateName]);
    newModel.userID = hooks.users[userName]._id;
    if(props) {
      for (let key in props) {
        newModel[key] = props[key];
      }
    }
    newModel.save()
    .then(model => resolve(model))
    .catch(err => reject(err));
  });
};

hooks.clearAll = function() {

  return Promise.all([
    User.remove({}),
    Loc.remove({})
  ])
  .then(() => {
    hooks.users = {};
    hooks .tokens = {};
    hooks.models = {};
  });
};
