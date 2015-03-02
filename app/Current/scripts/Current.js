'use strict'

angular.module('gistOfItApp').controller('CurrentCtrl', ['$scope', 'supersonic', '$localStorage', 'GistofitService', 
  function ($scope, supersonic, $localStorage, Gistofit) {
	
    $scope.loading = {'busy': false};
    $scope.gists = {};

    $scope.comment_gist = null;
    supersonic.bind($scope, "comment_gist");
    $scope.$storage = $localStorage;

    $scope.loadRecentGists = function() {
        Gistofit.getRecent().then(function (response) {
	    angular.forEach(response.data.gists, function(g) {
        	g.date = Date.parse(g.date);
		$scope.gists[g.id] = g;
	    });

            angular.forEach($scope.gists,function(gist){
                Gistofit.getExtract(gist.url.key.raw.name).then(function(data) {
			gist.extract = data;
		});

                Gistofit.getLikes(gist.id).then(function(response) {
                	gist.likes = response.data.map;
                	gist.userLiked = gist.likes[$scope.$storage.user.id] ? 1 : 0;
                });
            });

            $scope.cursor = response.data.nextCursor; 
            $scope.userServiceInfo = response.data.userServiceInfo;
            $scope.last_seen = response.data.lastSeen;
        });
    };
   
   $scope.deleteGist = function(index, id) {
        Gistofit.deleteGist(id).then(function (response) {
            $scope.gists.splice(index, 1);
          });
    };
    
   $scope.likeGist = function(id) {
        Gistofit.likeGist(id, $scope.$storage.user).then(function (response) {
        	$scope.gists[id].userLiked = 1;	
        	$scope.gists[id].likes.total++;	
	});
    };
  
   $scope.openURL = function(url) {
        var ref = window.open(url, '_blank', 'location=yes');
   };

    $scope.myPagingFunction = function () {
	if ($scope.loading.busy) return;
    	$scope.loading.busy = true;
        Gistofit.getRecent($scope.cursor).then(function (response) {
            angular.forEach(response.data.gists,function(gist){
                Gistofit.getExtract(gist.url.key.raw.name).then(function(data) {
			gist.extract = data;
		});

                Gistofit.getLikes(gist.id).then(function(response) {
                	gist.likes = response.data.map;
                	gist.userLiked = gist.likes[$scope.$storage.user.id] ? 1 : 0;
                });
                
		gist.date = Date.parse(gist.date); 
		$scope.gists[gist.id] = gist; 
            });

            if (response.data.nextCursor != "")
                $scope.cursor = response.data.nextCursor; 
            $scope.userServiceInfo = response.data.userServiceInfo;
            $scope.loading.busy = false;
	 });
    };
   
   $scope.onReload = function() {
      console.log('reloading');
      var deferred = $q.defer();
      setTimeout(function() {
        Gistofit.getNewest($scope.last_seen).then(function (response) {
            $scope.setGistExtract(response.data.gists[0]);
            $scope.gists.unshift.apply($scope.gists, response.data.gists);
            $scope.last_seen = response.data.lastSeen;
          });
        deferred.resolve(true);
      }, 1000);
      return deferred.promise;
    };
    
    $scope.loadRecentGists();
    steroids.view.navigationBar.show("Current");
    
    $scope.showArticle = function(article) {
        var articleView = new steroids.views.WebView({
            location: "http://localhost/views/Article/article.html",
            id: "article"
        });

        var message = {
            recipient: "articleView",
            article: article,
        };
        window.postMessage(message);
        
        var fastSlide = new steroids.Animation({  transition: "slideFromRight",  duration: .2});

        // Navigate to your view
        steroids.layers.push(
        {
            view: articleView,
            animation: fastSlide ,
        });
    };

    $scope.showComments = function(gist) {
	var commentsView = new supersonic.ui.View({
            location: "Comments#comments",
            id: "comments"
	});

        $scope.comment_gist = gist.id; 
        var fastSlide = new steroids.Animation({  transition: "slideFromRight",  duration: .2});
        supersonic.ui.layers.push(commentsView, { animation: fastSlide }); 
    }
}]);
