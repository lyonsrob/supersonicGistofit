'use strict'

angular.module('gistOfItApp').controller('CurrentCtrl', ['$scope', '$localStorage', 'supersonic', 'GistofitService', 
  function ($scope, $localStorage, supersonic, Gistofit) {
    $scope.$storage = $localStorage;

    $scope.loadRecentGists = function() {
        $scope.gists = {};

        Gistofit.getRecent().then(function (response) {
	    $scope.gists = response.data.gists; 
            angular.forEach($scope.gists,function(gist){
                Gistofit.getExtract(gist, gist.url.key.raw.name).then(function(data) {
			gist.extract = data;
		});

                Gistofit.getLikes(gist.id).then(function(response) {
                	gist.likes = response.data.map;
                	gist.userLiked = gist.likes[$scope.$storage.user.id] ? 1 : 0;
                	$scope.gists[gist.id] = gist;
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

    $scope.load_extract_content = function (content) {
        $scope.extract_content = content;
    };

    $scope.myPagingFunction = function () {
        Gistofit.getRecent($scope.cursor).then(function (response) {
            var promises = [];
        
            angular.forEach(response.data.gists,function(gist){
                promises.push($scope.setGistExtract(gist));
            });

            $q.all(promises).then(function success(data){
                $scope.gists = $scope.gists.concat(response.data.gists); 
            }, function failure(err){
                // Can handle this is we want
            });
           
            if (response.data.nextCursor != "")
                $scope.cursor = response.data.nextCursor; 
            $scope.userServiceInfo = response.data.userServiceInfo;
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
        var commentsView = new steroids.views.WebView({
            location: "http://localhost/views/Comments/comments.html",
            id: "comments"
        });
        
	var message = {
            recipient: "commentsView",
            id: gist.id,
            url: gist.url.key.raw.name
        };
        window.postMessage(message);
        
        var fastSlide = new steroids.Animation({  transition: "slideFromRight",  duration: .2});
        
        // Navigate to your view
        steroids.layers.push(
        {
            view: commentsView,
            animation: fastSlide 
        });
    };
}]);
