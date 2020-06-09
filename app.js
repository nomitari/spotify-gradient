(function() {

	var app = angular.module('GradientApp', ['ngRoute', 'ngColorThief']);

	app.config(function($routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: 'partials/main.html',
				controller: 'MainController'
			}).
			when('/users/:username', {
				templateUrl: 'partials/user.html',
				controller: 'UserController'
			}).
			when('/users/:username/playlists/:playlist', {
				templateUrl: 'partials/playlist.html',
				controller: 'PlaylistController'
			}).
			otherwise({
				redirectTo: '/',
				controller: 'MainController'
			});
	});

	app.controller('AppController', function($scope, $document, Auth, API, $location) {
		console.log('in AppController');
		console.log($document.prop( "body" ));

		console.log(location);


		function checkUser(redirectToLogin) {
			API.getMe().then(function(userInfo) {
				Auth.setUsername(userInfo.id);
				Auth.setDisplayName(userInfo.display_name);
				Auth.setUserCountry(userInfo.country);
				if (redirectToLogin) {
					$scope.$emit('login');
					$location.replace();
				}
			}, function(err) {
				$scope.showmain = false;
				$scope.showlogin = true;
				$location.replace();
			});
		}

		window.addEventListener("message", function(event) {
			console.log('got postmessage', event);
			var hash = JSON.parse(event.data);
			if (hash.type == 'access_token') {
				Auth.setAccessToken(hash.access_token, hash.expires_in || 60);
				checkUser(true);
			}
  		}, false);

		$scope.isLoggedIn = (Auth.getAccessToken() != '');
		$scope.showmain = $scope.isLoggedIn;
		$scope.showlogin = !$scope.isLoggedIn;

		$scope.$on('login', function() {
			$scope.showmain = true;
			$scope.showlogin = false;
			$location.path('/').replace().reload();
		});

		$scope.$on('logout', function() {
			$scope.showmain = false;
			$scope.showlogin = true;
		});

		$scope.getClass = function(path) {
			if ($location.path().substr(0, path.length) == path) {
				return 'active';
			} else {
				return '';
			}
		};
		
		checkUser();
	});

})();
