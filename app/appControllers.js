"use strict"
//application controller
var appController = angular.module('AppController', []);

appController.controller('HomeController', function($scope, $location, $log, Tracks) {
	$scope.maxSize = 1;
	$scope.max = 5;
	$scope.isReadonly = true;
	$scope.currentPage = 1;
	$scope.itemsPerPage = 10;
	Tracks.query({}, function(res) {
		$scope.getGenres(res);
		$scope.tracks = res;
		$scope.totalItems = $scope.tracks.length;
		$scope.pageChanged();
	});

	$scope.pageChanged = function() {
		var begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
		var end = begin + $scope.itemsPerPage;
		$scope.filteredTracks = $scope.tracks.slice(begin, end);
	};
	$scope.pageLabel = function(page){
		return "Page " + page;
	};
	$scope.editSong = function(trackId) {
		$location.path('/editTrack/' + trackId);
	};
	$scope.getGenres = function(arg) {
		for ( var x in arg) {
			var tempRow = arg[x];
			var genres = "";
			try {
				for (var y = 0; y < tempRow.genres.length; y++) {
					var tempGenre = tempRow.genres[y].name;
					if (typeof tempGenre !== "undefined") {
						if (y != tempRow.genres.length - 1) {
							genres = genres + tempGenre + " | ";
						} else {
							genres = genres + tempGenre;
						}
					}
				}
				arg[x].genres = genres;
			} catch (err) {
			}
		}
	};
});

appController.controller('TracksController', function($scope, $filter, $log, Tracks, Genre) {
	$scope.update = false;
	$scope.isReadonly = false;
	$scope.isReadOnly = false;
	var allGenres = [];
	$scope.queryGroups = function(search) {
		var firstPass = $filter('filter')(allGenres, search);
		return firstPass.filter(function(item) {
			return $scope.selectedGenres.indexOf(item) === -1;
		});
	};
	$scope.selectedGenres = [];
	$scope.genreIdList = [];
	$scope.$watchCollection('selectedGenres', function() {
		$scope.availableGroups = $scope.queryGroups('');
	});

	//function to find id of genre
	$scope.findIds = function(){
		for (var x in $scope.selectedGenres){
			for(var y in $scope.genres){				
				if ($scope.selectedGenres[x] === $scope.genres[y].name){
					$scope.genreIdList.push($scope.genres[y].id); 
					break;
				}
			}
		}
		$scope.formData.genres = $scope.genreIdList;
	}
	$scope.genreList = {};
	$scope.max = 5;
	$scope.genres = [];
	$scope.master = {};
	$scope.formData = {};
	$scope.genreArr = [];
	$scope.reset = function() {
		$scope.formData = angular.copy($scope.master);
		$scope.selectedGenres = [];
	}
	$scope.reset();
	Genre.query({}, function(res) {		
		$scope.genres = res;
		allGenres = $scope.getGenreNameList(res);
		$scope.allGenres = allGenres;	
	});
	$scope.getGenreNameList = function(genreArray){
		var genreList = [];
		for (var x in genreArray)			
			if (typeof genreArray[x].name !== "undefined")
				genreList.push(genreArray[x].name); 
		return genreList;
	};
	$scope.$watch("genreList", function() {
		$scope.genreArr[0] = $scope.genreList.id;
		$scope.formData.genres = $scope.genreArr;
	});
	$scope.createTrack = function() {
		$scope.findIds();		
		Tracks.save($scope.formData, function() {
			alert("saved");
		});
	};
});

appController.controller('EditTrackController', function($scope, $log, $filter,
	$routeParams, Tracks , Genre) {
	$scope.update = true;
	$scope.id = $routeParams.id;
	$scope.isReadonly = false;
	$scope.genreList = {};
	$scope.max = 5;
	$scope.genres = [];
	$scope.master = {};
	$scope.formData = {};
	$scope.genreArr = [];
	var allGenres = [];
	Genre.query({}, function(res) {		
		$scope.genres = res;
		allGenres = $scope.getGenreNameList(angular.copy(res));			
		$scope.allGenres = allGenres;	
	});
	$scope.getGenreNameList = function(genreArray){
		var genreList = [];
		for (var x in genreArray)			
			if (typeof genreArray[x].name !== "undefined")
				genreList.push(genreArray[x].name); 
		return genreList;
	};
	$scope.queryGroups = function(search) {
		var firstPass = $filter('filter')(allGenres, search);
		return firstPass.filter(function(item) {
			return $scope.selectedGenres.indexOf(item) === -1;
		});
	};
	$scope.selectedGenres = [];
	$scope.genreIdList = [];
	$scope.$watchCollection('selectedGenres', function() {
		$scope.availableGroups = $scope.queryGroups('');
	});
	//function to find id of genre
	$scope.findIds = function(){
		for (var x in $scope.selectedGenres){
			for(var y in $scope.genres){				
				if ($scope.selectedGenres[x] === $scope.genres[y].name){
					$scope.genreIdList.push($scope.genres[y].id); 
					break;
				}
			}
		}
		$scope.formData.genres = $scope.genreIdList;
	};
	Tracks.get({
		"id" : $scope.id
	}, function(res) {
		$scope.master = res;
		$scope.formData = angular.copy(res);
		$scope.master.selectedGenres = angular.copy($scope.getGenreNameList(angular.copy(res.genres)));
		$scope.selectedGenres = angular.copy($scope.master.selectedGenres);
	});
	$scope.reset = function() {
		$scope.formData = angular.copy($scope.master);
		$scope.selectedGenres = angular.copy($scope.master.selectedGenres);
	}
	$scope.$watch("genreList", function() {
		$scope.genreArr[0] = $scope.genreList.id;
		$scope.formData.genres = $scope.genreArr;
	});
	$scope.updateTrack = function() {
		Tracks.save({
			"id" : $scope.id
		}, $scope.formData, function(res) {
			alert("updated");
		});
	}
});

appController.controller('GenresController', function($scope, $log, Genre) {
	$scope.currentPage = 1;
	$scope.itemsPerPage = 10;
	$scope.maxSize = 1;
	$scope.pageChanged = function() {
		var begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
		var end = begin + $scope.itemsPerPage;
		$scope.filteredGenres = $scope.genres.slice(begin, end);
	};
	$scope.pageLabel = function(page){
		return "Page " + page;
	};
	$scope.getGenres = function() {
		Genre.query({}, function(res) {
			$scope.genres = res;
			$scope.totalItems = $scope.genres.length;
			$scope.pageChanged();
		});
	}
	$scope.genre = {};
	$scope.addClicked = false;
	$scope.editClicked = false;
	$scope.getGenres();
	$scope.editId = "";
	$scope.addNewGenre = function() {
		Genre.save($scope.genre, function(res) {
			alert("saved");
			$scope.addClicked = false;
			$scope.getGenres();
		});
	}
	$scope.editGenre = function(id) {
		$scope.editClicked = true;
		$scope.editId = id;
		$scope.genre.name = $scope.getGenreNameById(id);
	}
	$scope.getGenreNameById = function(id){
		for (var temp in $scope.genres){
			if ($scope.genres[temp].id === id){
				return $scope.genres[temp].name;
			}
		}
	}
	$scope.edit = function(id) {
		Genre.save({
			"id" : id
		}, $scope.genre, function(res) {
			alert("updated");
			$scope.editClicked = false;
		});
	}
});