(function() {
	
	var module = angular.module('PlayerApp');

	module.controller('PlaylistController', function($scope, $document, $rootScope, API, PlayQueue, $routeParams, Auth, $sce, $colorThief) {

		/// console.log($document.prop( "body" ));

		$scope.playlist = $routeParams.playlist;
		$scope.username = $routeParams.username;
		$scope.name = '';
		$scope.tracks = [];
		$scope.data = null;
		$scope.total_duration = 0;

		$scope.currenttrack = PlayQueue.getCurrent();
		$scope.isFollowing = false;
		$scope.isFollowHovered = false;

		$rootScope.$on('playqueuechanged', function() {
			$scope.currenttrack = PlayQueue.getCurrent();
		});

		API.getPlaylist($scope.username, $scope.playlist).then(function(list) {
			console.log('got playlist', list);
			$scope.name = list.name;
			$scope.data = list;
			$scope.image = list.images[0];
			$scope.playlistDescription = $sce.trustAsHtml(list.description);
		});

		/// $scope.follow = function(isFollowing) {
		/// 	if (isFollowing) {
		/// 		API.unfollowPlaylist($scope.username, $scope.playlist).then(function() {
		/// 			$scope.isFollowing = false;
		/// 			$rootScope.$emit('playlistsubscriptionchange');
		/// 		});
		/// 	} else {
		/// 		API.followPlaylist($scope.username, $scope.playlist).then(function() {
		/// 			$scope.isFollowing = true;
		/// 			$rootScope.$emit('playlistsubscriptionchange');
		/// 		});
		/// 	}
		/// };

		$scope.sortPlaylist = function() {
			console.log('sorting playlist tracks');
			//$scope.tracks = list.items;

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

   			// get color for all tracks in playlist
   			// getPlaylistColors
   			for (var i = 0; i < images.length; i++) {
   				var color, hsv = null;
   				/// var image = new Image();
   				/// image.crossOrigin = 'Anonymous';
   				/// var URLdata = images[i].src + '?' + new Date().getTime();
   				/// image.src = images[i].src + '?' + new Date().getTime();
	   			images[i].onload = function() {
	   				color = $colorThief.getColor(images[i]);
	   				hsv = rgb2hsv(color[0], color[1], color[2]);
	   				console.log('color: ', color);
	   				console.log("HSV: ", hsv);

	   				var image = images[i].id;
	   				sorted.push([image, hsv]);

	   			}();
			}

			// sort sorted array on hue [ [imageID, {h,s,v}] ]
			sorted = sorted.sort(function(a,b) {
				return a[1]['h'] - b[1]['h'];
			});

			var URISquery = []; 
			var URISbody = [];
			//collect list of URIs for new playlist

			for (var i in sorted) {
				//URISbody.push(`spotify:track:${sorted[i][0]}`);
				URISquery.push(`spotify:track:${sorted[i][0]}`);
			}

			// sort within playlist on spotify - use replace API
			// query and body params - list of track uris (spotify:track:4iV5W9uYEdYUVa79Axb7Rh)
			// can only do this for playlists < 100 tracks per PUT. this is a spotify limitation

   			//console.log("URIs: ", URISquery);

			API.sortPlaylistTracks($scope.username, $scope.playlist, URISquery).then(function(list) {
				window.location.reload(false); 
				$rootScope.$emit('playlistsorderchange');
			});

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

		API.isFollowingPlaylist($scope.username, $scope.playlist).then(function(booleans) {
			console.log("Got following status for playlist: " + booleans[0]);
			$scope.isFollowing = booleans[0];
		});

		$scope.follow = function(isFollowing) {
			if (isFollowing) {
				API.unfollowPlaylist($scope.username, $scope.playlist).then(function() {
					$scope.isFollowing = false;
					$rootScope.$emit('playlistsubscriptionchange');
				});
			} else {
				API.followPlaylist($scope.username, $scope.playlist).then(function() {
					$scope.isFollowing = true;
					$rootScope.$emit('playlistsubscriptionchange');
				});
			}
		};

		$scope.play = function(trackuri) {
			var trackuris = $scope.tracks.map(function(track) {
				return track.track.uri;
			});
			PlayQueue.clear();
			PlayQueue.enqueueList(trackuris);
			PlayQueue.playFrom(trackuris.indexOf(trackuri));
		};

		$scope.playall = function() {
			var trackuris = $scope.tracks.map(function(track) {
				return track.track.uri;
			});
			PlayQueue.clear();
			PlayQueue.enqueueList(trackuris);
			PlayQueue.playFrom(0);
		};

		$scope.toggleFromYourMusic = function(index) {
			if ($scope.tracks[index].track.inYourMusic) {
				API.removeFromMyTracks([$scope.tracks[index].track.id]).then(function(response) {
					$scope.tracks[index].track.inYourMusic = false;
				});
			} else {
				API.addToMyTracks([$scope.tracks[index].track.id]).then(function(response) {
					$scope.tracks[index].track.inYourMusic = true;
				});
			}
		};

		$scope.menuOptionsPlaylistTrack = function() {
			if ($scope.username === Auth.getUsername()) {
				return [[
					'Delete',
					function ($itemScope) {
						var position = $itemScope.$index;
						API.removeTrackFromPlaylist(
							$scope.username,
							$scope.playlist,
							$itemScope.t.track, position).then(function() {
								$scope.tracks.splice(position, 1);
							});
					}]]
			} else {
				return null;
			}
		};

	});

})();