SC.initialize({
  client_id: '99a996d1e10b2c6853d20024a896a5b4'
});
var scd = angular.module('SCD', ["ngRoute","ngAnimate"]).config(function($routeProvider,$locationProvider){
	$routeProvider.
        when('/', {
          templateUrl: '/views/home.html',
          controller: 'SCDController'
        }).
        when('/search/:search', {
          templateUrl: '/views/home.html',
          controller: 'SCDController'
        }).
        when('/:username', {
          templateUrl: '/views/username.html',
          controller: 'UserController'
        }).
        when('/:username/sets/:set', {
          templateUrl: '/views/sets.html'
        }).
        when('/:username/:song', {
          templateUrl: '/views/song.html',
          controller: 'SongController'
        }).
        otherwise('/');
    $locationProvider.html5Mode({
	  enabled: true,
	  requireBase: false
	});
}).controller('SCDController', function($window, $scope, $route, $routeParams, $location) {
     $scope.$route = $route;
     $scope.page = "home";
     $scope.searching = false;
     $scope.q = "";
     if(typeof $routeParams.search != "undefined")
     	$scope.q = $routeParams.search;
     $scope.search = function(){
     	if($scope.q == "") return;
     	$location.path('/search/'+$scope.q);
     }
     $scope.searchForTracks = function(){
     	SC.get('/tracks', {
		  q: $scope.q
		}).then(function(tracks) {
			$scope.tracks = tracks;
			$scope.$apply();
			$scope.searchForUsers();
		}).catch(function(error){
			console.log(error);
			$scope.searchForUsers();
		});
     }
     $scope.searchForUsers = function(){
     	SC.get('/users', {
		  q: $scope.q
		}).then(function(users) {
			$scope.users = users;
			$scope.$apply();
			$scope.searchForPlaylists();
		}).catch(function(error){
			console.log(error);
			$scope.searchForPlaylists();
		});
     }
     $scope.searchForPlaylists = function(){
     	SC.get('/playlists', {
		  q: $scope.q
		}).then(function(playlists) {
			$scope.playlists = playlists;
     		$scope.searching = false;
			$scope.$apply();
		}).catch(function(error){
			console.log(error);
     		$scope.searching = false;
			$scope.$apply();
		});
     }
     if(typeof $routeParams.search != "undefined" && $routeParams.search != ""){
     	$scope.searching = true;
     	$scope.searchForTracks();
     }

}).controller('UserController', function($scope, $route, $routeParams, $location) {
		$scope.q = $routeParams.username;
    	$scope.searching = false;
     	SC.get('/users/'+$routeParams.username).then(function(user) {
			$scope.user = user;
			$scope.$apply();
			console.log(user);
			SC.get('/users/'+$routeParams.username+"/tracks").then(function(tracks) {
				$scope.tracks = tracks;
				console.log(tracks);
				$scope.$apply();
			}).catch(function(error){
				console.log(error);
			});
		}).catch(function(error){
			console.log(error);
		});
     $scope.search = function(){
     	if($scope.q == "") return;
     	$location.path('/search/'+$scope.q);
     }
}).controller('SongController', function($http, $scope, $route, $routeParams, $location) {
		$scope.q = $routeParams.username;
    	$scope.searching = true;
/*     	SC.get('/i1/tracks/104624081/streams').then(function(song) {
			console.log(song);
			$scope.song = song;
			$scope.$apply();
		});*/
     	SC.get('/users/'+$routeParams.username).then(function(user) {
			$scope.user = user;
			$scope.$apply();
			console.log(user);
			SC.get('/resolve', {
			  url: "http://soundcloud.com/"+$routeParams.username+"/"+$routeParams.song
			}).then(function(song) {
				console.log(song);
				$scope.song = song;
	     		$scope.searching = false;
				$scope.$apply();
			}).catch(function(error){
				console.log(error);
	     		$scope.searching = false;
				$scope.$apply();
			});
		}).catch(function(error){
			console.log(error);
		});
     $scope.search = function(){
     	if($scope.q == "") return;
     	$location.path('/search/'+$scope.q);
     }
}).filter('bignumbers', function(){
	return function(input){
		var n = parseInt(input);
		if(n>1000) return Math.round(n/1000)+"k";
		else return n;
	}
});