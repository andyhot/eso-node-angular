'use strict';

var app = angular.module('esoNodeApp', ['ngResource']);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/views/main.html',
      controller: 'MainCtrl'
    })
    .when('/clubs', {
      templateUrl: '/views/clubs.html',
      controller: 'ClubsCtrl'
    })
    .when('/clubs/:id', {
      templateUrl: '/views/club_players.html',
      controller: 'ClubPlayersCtrl'
    })
    .when('/players', {
      templateUrl: '/views/players.html',
      controller: 'PlayersCtrl'
    })
    .when('/players/:id', {
      templateUrl: '/views/player.html',
      controller: 'PlayerCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.config(function($locationProvider){
  $locationProvider.html5Mode(true).hashPrefix('!');
});


app.factory('EsoResources', function($resource) {
  var prefix = '/api/v1';
  return {
    getPlayers: function() {
      return $resource(prefix + '/players/:id', {id:'@id'});
    },
    getClubs: function() {
      return $resource(prefix + '/clubs/:id', {id:'@id'});
    },
    getClubPlayers: function() {
      return $resource(prefix + '/clubs/:id/players', {id:'@id'});
    }
  };
});

app.filter('publicDate', function(){
  return function(text) {
    if (!text)
      return '-';

    var parts = text.split('-');
    if (parts.length!=3)
      return text;

    return parts[1] + '/' + parts[0];
  };
});
