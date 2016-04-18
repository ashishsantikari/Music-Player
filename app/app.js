'use strict';

/* defining the application */
var app = angular.module('myApp', [ 'ngRoute', 'AppController', 'TrackService',
		'GenreService', 'ui.bootstrap', 'ngMaterial' ]);

/* application routing */
app.config([ '$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider) {
			$routeProvider.when('/home', {
				templateUrl : "app/templates/homeTemplate.html",
				controller : 'HomeController'
			}).when('/addtrack', {
				templateUrl : "app/templates/tracksTemplate.html",
				controller : "TracksController"
			}).when('/editTrack/:id', {
				templateUrl : "app/templates/tracksTemplate.html",
				controller : "EditTrackController"
			}).when('/genres', {
				templateUrl : "app/templates/genresTemplate.html",
				controller : "GenresController"
			}).otherwise({
				redirectTo : '/home'
			});
			$locationProvider.html5mode = true;
		}
]);

/* manual boostraping of application */
angular.element(document).ready(function() {
	angular.bootstrap(document, [ 'myApp' ]);
});