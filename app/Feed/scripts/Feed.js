'use strict'

function toArrayObj(array) {
    for (var i = 0; i < array.length; ++i)
        array[i] = {link: array[i]};
    return array;
}

angular.module('gistOfItApp').controller('FeedCtrl', ['$scope', 'GistofitService', 'FeedService', 
  function ($scope, Gistofit, Feed) {
  
    steroids.view.setBackgroundImage({
      image: "/img/background.jpg"
    });
    
    // Create a view
    var feedURLs = [
        'http://feeds2.feedburner.com/Mashable',
        'http://www.tmz.com/rss.xml',
        'http://feeds.gawker.com/deadspin/full',
        'http://feeds.gawker.com/gizmodo/full',
        'http://feeds2.feedburner.com/businessinsider',
        'http://feeds.feedburner.com/TechCrunch',
        'http://rss.cnn.com/rss/cnn_topstories.rss',
        'http://sports.espn.go.com/espn/rss/news'
    ];

    $scope.loadFeed=function(e){        
        Feed.parseFeed($scope.feedSrc).then(function(res){
            $scope.loadButonText=angular.element(e.target).text();
            $scope.feeds=res.data.responseData.feed.entries;
        });
    }
    
    $scope.loadSearchFeed=function(){        
        Gistofit.searchTopUrls($scope.searchText).then(function(res){
            $scope.loadButonText=angular.element().text();
            $scope.feeds=toArrayObj(res.data);
        });
    }

    $scope.loadAllFeeds=function(e){      
        $scope.feeds = [];
        var promises = [];

        for (var i = 0, len = feedURLs.length; i < len; i++) {
            Feed.parseFeed(feedURLs[i]).then(function(res){
                angular.forEach(res.data.responseData.feed.entries,function(feed){
			var myRe = /http:\/\/www\.tmz\.com/g;

			feed.link = myRe.exec(feed.link) ? feed.link.replace(myRe, "http://m.tmz.com") : feed.link; 
			gaPlugin.trackEvent( nativePluginResultHandler, nativePluginErrorHandler, "Article", "Feed", feed.link, 1);
			Gistofit.getExtract(feed.link).then(function(data) {
			  feed.extract = data;
			  gaPlugin.trackEvent( nativePluginResultHandler, nativePluginErrorHandler, "Provider", "View", data.provider_name, 1);
			});
                });
                
                $scope.feeds.push.apply($scope.feeds, res.data.responseData.feed.entries);
            });
        }
        //shuffle($scope.feeds);
    }
   
   $scope.openURL = function(url) {
	gaPlugin.trackEvent( nativePluginResultHandler, nativePluginErrorHandler, "Article", "View", url, 1);
        var ref = window.open(url, '_blank', 'location=yes');
   }

    $scope.showGistPrompt = function(feed, index) {
	$scope.selectedFeed = index;
 
        var message = {
            recipient: "gistModalView",
            feed: feed
        }
       
        window.postMessage(message);
        
	var createGistView = new supersonic.ui.View({
            location: "Gist#add",
            id: "addGist"
	});

        var fastSlide = new steroids.Animation({  transition: "slideFromBottom",  duration: .2});
        supersonic.ui.layers.push(createGistView, { animation: fastSlide }); 
        //steroids.modal.show(createGistView);
    }
    
    $scope.loadAllFeeds();
    steroids.view.navigationBar.show("Discover");

supersonic.data.channel('add_gist').subscribe( function(message) {
	$scope.feeds.splice($scope.selectedFeed, 1);
	$scope.$apply();
}); 

}]);

angular.module('gistOfItApp').factory('FeedService',['$http',function($http){
    return {
        parseFeed : function(url){
            return $http.jsonp('https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
        }
    }
}]);
  
