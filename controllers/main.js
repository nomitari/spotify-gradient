(function() {

	var module = angular.module('GradientApp');

	module.controller('MainController', function($scope, $rootScope, Auth, API, $location, $filter) {
		$scope.view = 'welcome';
		$scope.profileUsername = Auth.getUsername();
		$scope.displayName = Auth.getDisplayName();
		$scope.playlists = [];

		function updatePlaylists() {
			if ($scope.profileUsername != '') {
				API.getPlaylists(Auth.getUsername()).then(function(items) {
					$scope.playlists = items.map(function(pl) {
						/// if (pl.owner.id == profileUsername) {
							return {
								id: pl.id,
								name: pl.name,
								uri: pl.uri,
								username: pl.owner.id,
								image: pl.images[0],
								tracks: pl.tracks
							};
						/// }
					});
				});
			}
		}

		updatePlaylists();

		// subscribe to an event
		$rootScope.$on('playlistsubscriptionchange', function() {
			updatePlaylists();
		});

		$scope.logout = function() {
			// do login!
			console.log('do logout...');
			Auth.setUsername('');
			Auth.setAccessToken('', 0);
			$scope.$emit('logout');
		};

		$scope.query = '';

		$scope.loadsearch = function() {
			$scope.playlists = $filter('filter')($scope.playlists, $scope.query);
			console.log('search for', $scope.query);
			/// var myParam = $location.search($scope.query);
			/// console.log('var', myParam);
			//$filter('filter')([], 'query');
			/// console.log($location.path('/search'));
			//$location.path('/search').search({ q: $scope.query }).replace();
		};

		$rootScope.$on('login', function() {
			$scope.profileUsername = Auth.getUsername();
			$scope.displayName = Auth.getDisplayName();
			updatePlaylists();
		});
		
	});

})();
