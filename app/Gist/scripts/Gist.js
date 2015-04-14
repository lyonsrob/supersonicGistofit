'use strict'

angular.module('gistOfItApp').controller('GistCtrl', ['$scope', '$localStorage', 'GistofitService', 
  function ($scope, $localStorage, Gistofit) {
    $scope.$storage = $localStorage;
    $scope.fbToggle;
    $scope.twToggle;

    var rightButton = new supersonic.ui.NavigationBarButton( {
      title: "Submit",
      onTap: function() {
	  $scope.addGist($scope.gist);
      }
    });

    var options = {
       title: "#GistOfIt",
       overrideBackButton: false,
       buttons: {
         right: [rightButton]
       }
    }

    supersonic.ui.navigationBar.update(options);

    var fb = document.getElementById('fb-button'),
    tw = document.getElementById('tw-button');

    $scope.toggleActive = function($event) {
      angular.element($event.currentTarget).toggleClass('toggled');
      
      if ($event.currentTarget == fb) {
      	$scope.fbToggle = !$scope.fbToggle;
	if ($scope.fbToggle) {
	   $scope.checkFb();
	}
      }
      
     if ($event.currentTarget == tw) {
        $scope.twToggle = !$scope.twToggle;
	if ($scope.twToggle) {
	   $scope.checkTw();
	}
      }
    };
    
    $scope.checkFb = function() {
	steroids.addons.facebook.api('/me/permissions', {
		access_token: $scope.$storage.accessToken,
		permissions: ["publish_actions"]
	}).then(function(response) {
	    console.log(response);
	});
    }
    
    $scope.checkTw = function() {
	var provider = steroids.addons.oauthio.provider('twitter');
	provider.auth().then(function() {
		console.log("User is authed");
	}).error(function(e) {
		console.log("Something went wrong with the auth. Error message: " + e.message);
	});
    }

    function postTw(gist) {
	    var provider = steroids.addons.oauthio.provider('twitter');
	    var postVars = encodeURIComponent("#gistofit: " + gist.content + " http://gistof.it/gist/" + gist.id);
		provider.api.post('/1.1/statuses/update.json?include_entities=true&status=' + postVars).then(JSON.parse).then(function(resp) {
	    		supersonic.data.channel('toast').publish("Gist Posted to Twitter");
			console.log(resp);
		});
    }

    
   
     function postFb(gist) {
	steroids.addons.facebook.api('/me/feed', {
		method: 'post',
		message: "#gistofit: " + gist.content,
		link: "http://www.gistof.it/gist/" + gist.id,
		access_token: $scope.$storage.accessToken,
		permissions: ["publish_actions"]
	}).then(function() {
	    supersonic.data.channel('toast').publish("Gist Posted to Facebook");
	    console.log('Published link to feed!');
	}, function(error) {
    		supersonic.logger.error("something wrong...");
  	});
     }
 
    supersonic.ui.views.current.params.onValue( function(values){
	$scope.gists = {};
	var url = values.url;
    	if (url) {
		Gistofit.getGistsForURL(url).then(function(response) {
		    angular.forEach(response.data.gists, function(g) {
			g.date = Date.parse(g.date);
			$scope.gists[g.id] = g;
		    });

		    angular.forEach($scope.gists,function(gist){
			if (gist.url) {
				Gistofit.getExtract(gist.url.key.raw.name).then(function(data) {
					gist.extract = data;
				});
			}

			if (gist.id) {
				(function refreshLikeCount() {
				Gistofit.getLikes(gist.id).then(function(response) {
					gist.likes = response.data.map;
					gist.userLiked = gist.likes[$scope.$storage.user.id] ? 1 : 0;
					$timeout(refreshLikeCount, 1000);
				});
				})();
				(function refreshCommentCount() {
					Gistofit.getComments(gist.id).then(function(response) {
						gist.comments = response.data;
						$timeout(refreshCommentCount, 1000);
					});
				})();
			}
		    });

		    $scope.cursor = response.data.nextCursor; 
		    $scope.last_seen = response.data.lastSeen;
		});
       }
    });
    
    $scope.setAddData = function(event) {
        if (event.data.recipient == "gistModalView") {
    	    $scope.gist = "";
            $scope.extract = event.data.feed.extract;
            $scope.url = event.data.feed.extract.url;
            $scope.$apply();
        }
    }
    
    $scope.addGist = function(gist) {
        Gistofit.addGist($scope.url, gist, $scope.$storage.user.id).then(function(response){
		if ($scope.fbToggle) {
			postFb(response.data);	
		}
		if ($scope.twToggle) {
			postTw(response.data);	
		}
	});

        supersonic.ui.tabs.select(1, {
	  onSuccess:function(data){
	    var message = {
	    	gist: gist
	    }

	    supersonic.data.channel('add_gist').publish(message);
	      
            supersonic.ui.layers.pop(); 
	  },
	  onFailure:function(error){
	    supersonic.logger.log(error);
	  }
	});

    }

    window.addEventListener("message", $scope.setAddData);

}    
]);
