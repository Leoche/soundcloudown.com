var scd = angular.module('SCD', ["ngRoute"]).config(function($routeProvider,$locationProvider){
	$routeProvider.
        when('/', {
          templateUrl: 'views/home.html'
        }).
        when('/:username', {
          templateUrl: 'views/username.html'
        }).
        otherwise('/');
    $locationProvider.html5Mode({
	  enabled: true,
	  requireBase: false
	});
}).controller('SCDController', function($scope, $route, $routeParams, $location) {
     $scope.$route = $route;
     $scope.page = "home";
});