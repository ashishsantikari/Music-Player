"use strict";
var trackService  = angular.module('TrackService' , ['ngResource']);
trackService.factory('Tracks' , ['$resource',function($resource){
	return $resource('http://104.197.128.152:8000/v1/tracks/:id');
}]);

var genreService = angular.module('GenreService', [ 'ngResource' ]);
genreService.factory('Genre', function($resource) {
	return $resource('http://104.197.128.152:8000/v1/genres/:id');
});
