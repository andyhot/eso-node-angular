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
  // used to parse JSON object given in the request body
  app.use(express.bodyParser());
});

app.set('views', __dirname + '/../app');
app.engine('html', require('ejs').renderFile);

var mainHandler = function (request, response) {
  response.render('index.html');
};

app.get('/', mainHandler);
app.get(/^\/clubs(\/.*)?$/, mainHandler);
app.get(/^\/players(\/.*)?$/, mainHandler);

// API

app.configure(function(){
  app.use('/api/v1', require('./api.js').create(pool));
});

app.get('/api/v1/players/:id', function (request, response) {

  var id = esoUtils.asInt(request.params, 'id');

  pool.query(
    'SELECT id, code, trim (from firstname) as firstname, trim (from lastname) as lastname, fathername, mothername, to_char(birthdate, \'YYYY-MM-DD\') as birthdate, rating, clu_id ' +
    'FROM players WHERE id = $1', [id], function(err, result) {

    if (err) {
      response.json({'err':err});
      return;
    }

    var rows = result.rows;
    response.json({player: rows.length===1 ? rows[0] : null});
  });

});

app.get('/api/v1/clubs/:id', function (request, response) {

	var id = esoUtils.asInt(request.params, 'id');

	pool.query(
		'SELECT id, code, trim (from name) as name ' +
		'FROM clubs WHERE id = $1', [id], function(err, result) {

		if (err) {
			response.json({'err':err});
			return;
		}

		var rows = result.rows;
		response.json({club: rows.length===1 ? rows[0] : null});
	});

});

app.get('/api/v1/clubs/:id/players', function (request, response) {

	var id = esoUtils.asInt(request.params, 'id');
	var offset = esoUtils.asInt(request.query, 'offset');
	var limit = esoUtils.asInt(request.query, 'limit', 10, 50);
	var q = request.query.q;
	var hasQuery = q || q===null || q==='',
		queryPart = '';
	var qParams = [id, limit, offset];

	if (hasQuery) {
		if (q && q.length>2) {
			queryPart = 'AND lastname LIKE $4 ';
			qParams.push('%' + q.toUpperCase() + '%');
		} else {
			queryPart = 'AND 1=2 ';
		}
	}

	pool.query(
		'SELECT id, code, trim (from firstname) as firstname, trim (from lastname) as lastname, fathername, mothername, to_char(birthdate, \'YYYY-MM-DD\') as birthdate, rating, clu_id ' +
		'FROM players WHERE code::integer<100000 AND clu_id= $1 ' + queryPart +
		'ORDER BY code LIMIT $2 OFFSET $3', qParams, function(err, result) {
		//eyes.inspect(result);
		if (err) {
			response.json({'err':err});
			return;
		}

		var rows = result.rows;
		response.json({players: rows});
	});

});

module.exports = app;
