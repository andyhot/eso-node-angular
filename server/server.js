'use strict';
var anyDB = require('any-db');
anyDB.adapters.postgres.forceJS = true;

var conString = 'postgres://eso:eso@localhost/eso';

var pool = anyDB.createPool(conString, {min: 2, max: 20});

var esoUtils = require('./utils.js');

var eyes = require('eyes');
var express = require('express');
var app = express();

app.configure('development', function(){
  app.set('db uri', 'tcp://eso:eso@localhost/eso');
});

app.configure('production', function(){
  app.use(express.static(__dirname + '/../dist'));
});

app.configure(function(){
  app.use(express.bodyParser());
});

app.use(function (request, response, next) {
  // rewrite for club and players urls to enhance javascript navigation
  var path = request.path;

  if (path==='/' || path.match(/^\/clubs(\/.*)?$/) || path.match(/^\/players(\/.*)?$/)) {
    request.url = '/index.html';
  }
  next();

});

app.configure(function(){
  // this is our rest api
  //app.use('/api/v1', require('./api.js').create(pool));
  require('./api.js').setup(app, '/api/v1', pool);
});

module.exports = app;
