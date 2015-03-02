'use strict'

angular.module('gistOfItApp').controller('TrendingCtrl', ['$scope', 'GistofitService', 
  function ($scope, Gistofit) {
    $scope.loadTrendingGists = function() {
        $scope.gists = null; 
        
        Gistofit.getTrending().then(function (response) {
            $scope.gists = response.data.gists;

            angular.forEach($scope.gists,function(gist){
                Gistofit.getExtract(gist.url.key.raw.name).then(function(data) {
                        gist.extract = data;
                });

            });

            $scope.cursor = response.data.nextCursor; 
            $scope.userServiceInfo = response.data.userServiceInfo;
            $scope.last_seen = response.data.lastSeen;
          });
    }
    
    $scope.openURL = function(url) {
		var ref = window.open(url, '_blank', 'location=yes');
	   }

    
    $scope.showArticle = function(article) {
        var message = {
            recipient: "articleView",
            article: article,
        }
        window.postMessage(message);
        
        var articleView = new steroids.views.WebView({
            location: "http://localhost/views/Article/article.html",
            id: "article"
        });
        
        var fastSlide = new steroids.Animation({  transition: "slideFromRight",  duration: .2});

        // Navigate to your view
        steroids.layers.push(
        {
            view: articleView,
            animation: fastSlide
        });
    }
    
    steroids.logger.log('loading trending gists!');
    $scope.loadTrendingGists();
    steroids.view.navigationBar.show("Trending");

}]);
