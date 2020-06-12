(function() {

	var module = angular.module('GradientApp');

	module.controller('UserController', function($scope, $routeParams, API) {
		$scope.profileUsername = $routeParams.username;
		$scope.data = null;
		$scope.playlistError = null;
		$scope.imagesrc = "../images/default-user.svg";

		API.getUser($scope.profileUsername).then(function(user) {
			console.log('got user', user);
			$scope.data = user;
			if ($scope.data.images.length) {
				$scope.imagesrc = $scope.data.images[0]['url'];
			}
		});

		API.getPlaylists($scope.profileUsername).then(function(userplaylists){
			console.log('got user playlists', userplaylists);
			$scope.userplaylists = userplaylists;
		}, function(reason){
			console.log("got error", reason);
			$scope.playlistError = true;
		});

	});

})();
