(function() {
	
	var module = angular.module('GradientApp');

	module.controller('PlaylistController', function($scope, $document, $rootScope, API, $routeParams, Auth, $sce, $colorThief) {

		$scope.playlist = $routeParams.playlist;
		$scope.username = $routeParams.username;
		$scope.name = '';
		$scope.tracks = [];
		$scope.data = null;

		API.getPlaylist($scope.username, $scope.playlist).then(function(list) {
			console.log('got playlist', list);
			$scope.name = list.name;
			$scope.data = list;
			$scope.image = list.images[0];
			$scope.playlistDescription = $sce.trustAsHtml(list.description);
		});

		$scope.sortPlaylist = function() {
			// can only sort playlists with 100 or fewer tracks
			if ($scope.data.tracks.total <= 100) {
				// can only sort playlists you own - get profile username and playlist owner
				API.getMe().then(function(list) {
					$scope.user = list.id;

					if ($scope.username == $scope.user) {
						var verify = confirm("Are you sure? This action cannot be reversed.");
						if (verify) {
							console.log('sorting playlist tracks');

							var images = $document[0].getElementsByClassName('track-cover');
							var sorted = [];

							// source: https://stackoverflow.com/questions/8022885/rgb-to-hsv-color-in-javascript
							function rgb2hsv (r, g, b) {
								let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
								rabs = r / 255;
								gabs = g / 255;
								babs = b / 255;
								v = Math.max(rabs, gabs, babs),
								diff = v - Math.min(rabs, gabs, babs);
								diffc = c => (v - c) / 6 / diff + 1 / 2;
								percentRoundFn = num => Math.round(num * 100) / 100;
								if (diff == 0) {
									h = s = 0;
								} else {
									s = diff / v;
									rr = diffc(rabs);
									gg = diffc(gabs);
									bb = diffc(babs);

									if (rabs === v) {
										h = bb - gg;
									} else if (gabs === v) {
										h = (1 / 3) + rr - bb;
									} else if (babs === v) {
										h = (2 / 3) + gg - rr;
									}
									if (h < 0) {
										h += 1;
									}else if (h > 1) {
										h -= 1;
									}
								}
								return {
									h: Math.round(h * 360),
									s: percentRoundFn(s * 100),
									v: percentRoundFn(v * 100)
								};
							}

							// getPlaylistColors - get color for all tracks in playlist
							for (var i = 0; i < images.length; i++) {
								var color, hsv = null;
								images[i].onload = function() {
									color = $colorThief.getColor(images[i]);
									hsv = rgb2hsv(color[0], color[1], color[2]);
									console.log('color: ', color);
									console.log("HSV: ", hsv);

									var image = images[i].id;
									sorted.push([image, hsv]);

								}();
							}

							// remove all elements within certain b&w threshold
							// this is for visual continuity in final playlist
							var bw = [];
							var colored = [];
							for (var i = 0; i < sorted.length; i++) {
								if (sorted[i][1]['v'] <= 8 || sorted[i][1]['s'] <= 20) {
									bw.push(sorted[i]);
								}
								else {
									colored.push(sorted[i]);
								}
							}

							// sort arrays [ [imageID, {h,s,v}] ]
							colored = colored.sort(function(a,b) {
								return a[1]['h'] - b[1]['h'] || a[1]['v'] - b[1]['v'];
							});

							bw = bw.sort(function(a,b) {
								return a[1]['v'] - b[1]['v'] || a[1]['h'] - b[1]['h'];
							});

							var finalTracklist = colored.concat(bw);
							var URIs = []; 

							for (var i in finalTracklist) {
								URIs.push(`spotify:track:${finalTracklist[i][0]}`);
							}

							API.sortPlaylistTracks($scope.username, $scope.playlist, URIs).then(function(list) {
								window.location.reload(false); 
								$rootScope.$emit('playlistsorderchange');
							});
						}
						
					}
					else {
						// not owner of playlist
						// TODO - remove button on page load instead
						window.alert('You can only sort playlists that you own.')
					}
				});
			}
			else {
				// too many tracks - will be truncated at 100
				// TODO - remove button on page load instead
				window.alert('Your playlist must have 100 or fewer tracks.')
			}
		};

		API.getPlaylistTracks($scope.username, $scope.playlist).then(function(list) {
			console.log('got playlist tracks', list);
			var tot = 0;
			list.items.forEach(function(track) {
				tot += track.track.duration_ms;
			});
			$scope.tracks = list.items;
			console.log('tot', tot);
			$scope.total_duration = tot;

			// find out if they are in the user's collection
			var ids = $scope.tracks.map(function(track) {
				return track.track.id;
			});

			var i, j, temparray, chunk = 20;
			for (i = 0, j = ids.length; i < j; i += chunk) {
					temparray = ids.slice(i, i + chunk);
					var firstIndex = i;
					(function(firstIndex){
						API.containsUserTracks(temparray).then(function(results) {
							results.forEach(function(result, index) {
								$scope.tracks[firstIndex + index].track.inYourMusic = result;
							});
						});
					})(firstIndex);
			}
		});

	});

})();