'use strict'

angular.module('gistOfItApp').controller('TrendingCtrl', ['$scope', 'GistofitService', '$timeout', 
  function ($scope, Gistofit, $timeout) {
    $scope.loadTrendingGists = function() {
        $scope.gists = null; 
        
        Gistofit.getTrending().then(function (response) {
            $scope.gists = response.data.gists;

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
            $scope.userServiceInfo = response.data.userServiceInfo;
            $scope.last_seen = response.data.lastSeen;
          });
    }
    
    $scope.openURL = function(url) {
		var ref = window.open(url, '_blank', 'location=yes');
	   }

    $scope.showComments = function(gist) {
	var commentsView = new supersonic.ui.View({
            location: "Comments#comments",
            id: "comments"
	});

	var message = {
	  sender: "Trending#trending",
	  gistId: gist.id
	};

	supersonic.data.channel('load_comments').publish(message);
        
        var fastSlide = new steroids.Animation({  transition: "slideFromRight",  duration: .2});
        supersonic.ui.layers.push(commentsView, { animation: fastSlide }); 
    }
    
    steroids.logger.log('loading trending gists!');
    $scope.loadTrendingGists();
    steroids.view.navigationBar.show("Trending");

}]);
