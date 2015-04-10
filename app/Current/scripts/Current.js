'use strict'

angular.module('gistOfItApp').controller('CurrentCtrl', ['$scope', 'supersonic', '$localStorage', 'GistofitService', '$q', '$timeout', 
  function ($scope, supersonic, $localStorage, Gistofit, $q, $timeout) {
    steroids.view.setBackgroundImage({
      image: "/img/background.jpg"
    });

  function setupLikes(gist) {
	(function refreshLikeCount() {
		Gistofit.getLikes(gist.id).then(function(response) {
			gist.likes = response.data.map;
			gist.userLiked = gist.likes[$scope.$storage.user.id] ? 1 : 0;
			//$timeout(refreshLikeCount, 1000);
		});
	})();
  }
  
  function setupComments(gist) {
	(function refreshCommentCount() {
		Gistofit.getComments(gist.id).then(function(response) {
			gist.comments = response.data;
			//$timeout(refreshCommentCount, 1000);
		});
	})();
  }
 	
  supersonic.data.channel('toast').subscribe( function(message) {
	window.plugins.toast.showShortCenter(message);
  });

  supersonic.data.channel('add_gist').subscribe( function(message) {
	    var target = $("div.content");
	 
	    //disable touch scroll to kill existing inertial movement
	    target.css({
		'-webkit-overflow-scrolling' : 'auto',
		'overflow-y' : 'hidden'
	    });
	 
	    //animate
	    target.animate({ scrollTop: 0}, 300, "swing", function(){
	 
		//re-enable touch scrolling
		target.css({
		    '-webkit-overflow-scrolling' : 'touch',
		    'overflow-y' : 'scroll'
		});
	    });
	    $scope.onReload();
  });
    
    $scope.loading = {'busy': false};
    $scope.gists = {};

    $scope.$storage = $localStorage;

    function _initGist(gist) {
	gist.date = Date.parse(gist.date);
	$scope.gists[gist.id] = gist;
	
	if (gist.url) {
		Gistofit.getExtract(gist.url.key.raw.name).then(function(data) {
			gist.extract = data;
		});
	}

	if (gist.id) {
		var label = "gist_" + gist.id; 
		gaPlugin.trackEvent( nativePluginResultHandler, nativePluginErrorHandler, "Gist", "Feed", label, 1);
		setupLikes(gist);
		setupComments(gist);
	}

	if (gist.user) {
		Gistofit.getUser(gist.user.key.raw.id).then(function (response) {
			angular.extend(gist.user, response.data);
		});
	}
    }

    $scope.loadRecentGists = function() {
        Gistofit.getRecent().then(function (response) {
	    angular.forEach(response.data.gists, function(gist) {
		_initGist(gist);
	    });

            $scope.cursor = response.data.nextCursor; 
            $scope.userServiceInfo = response.data.userServiceInfo;
            $scope.last_seen = response.data.lastSeen;
        });
    };
   
   $scope.deleteGist = function(index, id) {
	if (id) {
		Gistofit.deleteGist(id).then(function (response) {
		    $scope.gists.splice(index, 1);
		  });
	}
    };
    
   $scope.likeGist = function(id) {
	if (id) {
		Gistofit.likeGist(id, $scope.$storage.user).then(function (response) {
			$scope.gists[id].userLiked = 1;	
			$scope.gists[id].likes.total++;	
		});
	}
    };
  
   $scope.openURL = function(url) {
	gaPlugin.trackEvent( nativePluginResultHandler, nativePluginErrorHandler, "Article", "View", url, 1);
        var ref = window.open(url, '_blank', 'location=yes');
   };

    $scope.myPagingFunction = function () {
	if ($scope.loading.busy) return;
    	$scope.loading.busy = true;
        Gistofit.getRecent($scope.cursor).then(function (response) {
            angular.forEach(response.data.gists,function(gist){
		_initGist(gist);
            });

            if (response.data.nextCursor != "")
                $scope.cursor = response.data.nextCursor; 
            $scope.userServiceInfo = response.data.userServiceInfo;
            $scope.loading.busy = false;
	 });
    };
   
   $scope.onReload = function() {
      var deferred = $q.defer();
      setTimeout(function() {
        Gistofit.getNewest($scope.last_seen).then(function (response) {
            angular.forEach(response.data.gists,function(gist){
		_initGist(gist)
            });
	    
	    if (response.data.lastSeen) {
            	$scope.last_seen = response.data.lastSeen;
	    }
          });
        deferred.resolve(true);
    	$scope.$apply()
      }, 1000);
      return deferred.promise;
    };
    
    $scope.loadRecentGists();
    steroids.view.navigationBar.show("Gists");
    
    $scope.showComments = function(gist) {
	var commentsView = new supersonic.ui.View({
            location: "Comments#comments",
            id: "comments"
	});

	var message = {
	  sender: "Current#current",
	  gistId: gist.id
	};

	supersonic.data.channel('load_comments').publish(message);
        
        var fastSlide = new steroids.Animation({  transition: "slideFromRight",  duration: .2});
        supersonic.ui.layers.push(commentsView, { animation: fastSlide }); 
    }
}]);
