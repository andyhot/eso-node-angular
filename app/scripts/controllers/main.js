'use strict';

angular.module('esoNodeApp')
  .controller('MainCtrl', function ($scope) {
    $scope.search = function() {
      console.debug('need to search!');
    };
  })
  .controller('ClubsCtrl', function ($scope, EsoResources) {
    var Clubs = EsoResources.getClubs();

    $scope.clubs = Clubs.get();
  })
  .controller('PlayersCtrl', function ($scope, EsoResources) {
    var Players = EsoResources.getPlayers();

    $scope.players = Players.get();
  })
  ;
