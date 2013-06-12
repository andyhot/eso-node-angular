var esoUtils = require('./utils.js');

var api = {

	create : function(pool) {

		return function(req, res, next) {

			if (req.path==='/players') {
				api.handlePlayers(req, res, pool);
			} else if (req.path==='/clubs') {
				api.handleClubs(req, res, pool);
			} else {
				next();
			}

		};
	},

	handlePlayers: function(req, res, pool) {
		var offset = esoUtils.asInt(req.query, 'offset');
		var limit = esoUtils.asInt(req.query, 'limit', 10, 50);
		var q = req.query.q;
		var hasQuery = q || q===null || q==='',
			queryPart = '';
		var qParams = [limit, offset];

		if (hasQuery) {
			if (q && q.length>2) {
				queryPart = 'AND lastname like $3 ';
				qParams.push('%' + q.toUpperCase() + '%');
			} else {
				queryPart = 'AND 1=2 ';
			}
		}

		pool.query(
			'SELECT id, code, trim (from firstname) as firstname, trim (from lastname) as lastname, fathername, mothername, to_char(birthdate, \'YYYY-MM-DD\') as birthdate, rating, clu_id ' +
			'FROM players WHERE code::integer<100000 ' + queryPart +
			'ORDER BY code LIMIT $1 OFFSET $2', qParams, function(err, result) {
			//eyes.inspect(result);
			if (err) {
				res.json({'err':err});
				return;
			}

			var rows = result.rows;
			res.json({players: rows});
		});
	},

	handleClubs: function(req, res, pool) {
		var offset = esoUtils.asInt(req.query, 'offset');
		var limit = esoUtils.asInt(req.query, 'limit', 10, 50);
		var q = req.query.q;
		var hasQuery = q || q===null || q==='',
			queryPart = '';
		var qParams = [limit, offset];

		if (hasQuery) {
			if (q && q.length>2) {
				queryPart = 'AND name like $3 ';
				qParams.push('%' + q.toUpperCase() + '%');
			} else {
				queryPart = 'AND 1=2 ';
			}
		}

		pool.query(
			'SELECT id, code, trim (from name) as name ' +
			'FROM clubs WHERE greek=true ' + queryPart +
			'ORDER BY code LIMIT $1 OFFSET $2', qParams, function(err, result) {
			//eyes.inspect(result);
			if (err) {
				res.json({'err':err});
				return;
			}

			var rows = result.rows;
			res.json({clubs: rows});
		});
	}

};

module.exports = {
	create: api.create
};