'use strict';

angular.module('esoNodeApp')
  .controller('MainCtrl', function ($scope, EsoResources) {
    var Clubs = EsoResources.getClubs();
    var Players = EsoResources.getPlayers();

    $scope.data = {
      q : null
    };
    $scope.search = function() {
      var q = $scope.data.q;
      if (!q || q.length<3) {
        $scope.clubs = null;
        $scope.players = null;
        return;
      }

      $scope.clubs = Clubs.get({q:q});
      $scope.players = Players.get({q:q});
    };

    $scope.$watch('data.q', $scope.search);

    $scope.showClubs = function() {
      return $scope.clubs && $scope.clubs.clubs.length>0;
    };
    $scope.showPlayers = function() {
      return $scope.players && $scope.players.players.length>0;
    };
  })
  .controller('ClubsCtrl', function ($scope, EsoResources) {
    var Clubs = EsoResources.getClubs();

    $scope.clubs = Clubs.get();
  })
  .controller('ClubPlayersCtrl', function ($scope, $routeParams, EsoResources) {
    var Clubs = EsoResources.getClubs(),
        ClubPlayers = EsoResources.getClubPlayers();

    var id = $routeParams.id;
    $scope.club = Clubs.get({id:id});
    $scope.players = ClubPlayers.get({id:id});
  })
  .controller('PlayersCtrl', function ($scope, EsoResources) {
    var Players = EsoResources.getPlayers();

    $scope.players = Players.get();
  })
  .controller('PlayerCtrl', function ($scope, $routeParams, EsoResources) {
    var Players = EsoResources.getPlayers();

    var id = $routeParams.id;
    $scope.player = Players.get({id:id});
  })
  ;
