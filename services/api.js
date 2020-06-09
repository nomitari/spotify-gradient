(function() {

	var module = angular.module('GradientApp');

	module.factory('API', function(Auth, $q, $http) {

		var baseUrl = 'https://api.spotify.com/v1';

		return {

			getMe: function() {
				var ret = $q.defer();
				$http.get(baseUrl + '/me', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got userinfo', r);
					ret.resolve(r);
				}).error(function(err) {
					console.log('failed to get userinfo', err);
					ret.reject(err);
				});
				return ret.promise;
			},

			getMyUsername: function() {
				var ret = $q.defer();
				$http.get(baseUrl + '/me', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got userinfo', r);
					//ret.resolve(r.id);
					ret.resolve('test_1');
				}).error(function(err) {
					console.log('failed to get userinfo', err);
					//ret.reject(err);
					//
					ret.resolve('test_1');
				});
				return ret.promise;
			},

			getMyTracks: function() {
				var ret = $q.defer();
				$http.get(baseUrl + '/me/tracks', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got user tracks', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			containsUserTracks: function(ids) {
				var ret = $q.defer();
				$http.get(baseUrl + '/me/tracks/contains?ids=' + encodeURIComponent(ids.join(',')), {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got contains user tracks', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			getPlaylists: function(username) {
				var limit = 50;
				var ret = $q.defer();
				var playlists = [];

				$http.get(baseUrl + '/users/' + encodeURIComponent(username) + '/playlists', {
					params: {
						limit: limit
					},
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					playlists = playlists.concat(r.items);

					var promises = [],
							total = r.total,
							offset = r.offset;

					while (total > limit + offset) {
						promises.push(
							$http.get(baseUrl + '/users/' + encodeURIComponent(username) + '/playlists', {
								params: {
									limit: limit,
									offset: offset + limit
								},
								headers: {
									'Authorization': 'Bearer ' + Auth.getAccessToken()
								}
							})
						);
						offset += limit;
					};

					$q.all(promises).then(function(results) {
						results.forEach(function(result) {
							playlists = playlists.concat(result.data.items);
						})
						console.log('got playlists', playlists);
						ret.resolve(playlists);
					});

				}).error(function(data, status, headers, config) {
					ret.reject(status);
				});
				return ret.promise;
			},

			getPlaylist: function(username, playlist) {
				var ret = $q.defer();
				$http.get(baseUrl + '/users/' + encodeURIComponent(username) + '/playlists/' + encodeURIComponent(playlist), {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got playlists', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			getPlaylistTracks: function(username, playlist) {
				var ret = $q.defer();
				$http.get(baseUrl + '/users/' + encodeURIComponent(username) + '/playlists/' + encodeURIComponent(playlist) + '/tracks', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got playlist tracks', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			sortPlaylistTracks: function(username, playlist, URIs) {
				var ret = $q.defer();
				//can only do request with 100 items
				$http.put(baseUrl + '/users/' + encodeURIComponent(username) + '/playlists/' + encodeURIComponent(playlist) + '/tracks?' + 
					'uris=' + URIs, {}, {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken(),
						'Content-Type': 'application/json'
					}
				}).success(function(r) {
					console.log('sorted playlist tracks', r);
					ret.resolve(r);
				}).error(function(err) {
					console.log('failed to sort playlist', err);
					ret.reject(err);
				});
				return ret.promise;
			},

			getTrack: function(trackid) {
				var ret = $q.defer();
				$http.get(baseUrl + '/tracks/' + encodeURIComponent(trackid), {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got track', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			getTracks: function(trackids) {
				var ret = $q.defer();
				$http.get(baseUrl + '/tracks/?ids=' + encodeURIComponent(trackids.join(',')), {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got tracks', r);
					ret.resolve(r);
				});
				return ret.promise;
			},

			getUser: function(username) {
				var ret = $q.defer();
				$http.get(baseUrl + '/users/' +
					encodeURIComponent(username),
				{
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).success(function(r) {
					console.log('got userinfo', r);
					ret.resolve(r);
				}).error(function(err) {
					console.log('failed to get userinfo', err);
					ret.reject(err);
				});
				return ret.promise;
			},

		};
	});

})();
