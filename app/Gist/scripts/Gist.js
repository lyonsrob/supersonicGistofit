'use strict'

angular.module('gistOfItApp').controller('GistCtrl', ['$scope', '$localStorage', 'GistofitService', 
  function ($scope, $localStorage, Gistofit) {
    $scope.$storage = $localStorage;
    $scope.fbToggle;

    $scope.toggleActive = function($event) {
      angular.element($event.currentTarget).toggleClass('toggled');
      $scope.fbToggle = !$scope.fbToggle;
    };
    
    $scope.checkFb = function() {
	steroids.addons.facebook.api('/me/permissions', {
		access_token: $scope.$storage.accessToken,
		permissions: ["publish_actions"]
	}).then(function(response) {
	    console.log(response);
	});
    }
    
   
     function postLike(gist) {
	steroids.addons.facebook.api('/me/feed', {
		method: 'post',
		message: "#gistofit: " + gist.content,
		link: "https://erudite-flag-623.appspot.com/gist/" + gist.id,
		access_token: $scope.$storage.accessToken,
		permissions: ["publish_actions"]
	}).then(function() {
	    console.log('Published link to feed!');
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
			postLike(response.data);	
		}
	});

        supersonic.ui.tabs.select(1, {
	  onSuccess:function(data){
	    var message = {
	    	gist: gist
	    }

	    supersonic.data.channel('add_gist').publish(message);
	       
            steroids.modal.hide();
	  },
	  onFailure:function(error){
	    supersonic.logger.log(error);
	  }
	});

    }

    window.addEventListener("message", $scope.setAddData);

}    
]);
