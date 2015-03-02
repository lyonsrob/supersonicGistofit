'use strict'

function toArrayObj(array) {
    for (var i = 0; i < array.length; ++i)
        array[i] = {link: array[i]};
    return array;
}

angular.module('gistOfItApp').controller('FeedCtrl', ['$scope', 'GistofitService', 'FeedService', 
  function ($scope, Gistofit, Feed) {
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
                    Gistofit.getExtract(feed.link).then(function(data) {
                        feed.extract = data;
                    });
                });
                
                $scope.feeds.push.apply($scope.feeds, res.data.responseData.feed.entries);
            });
        }
        //shuffle($scope.feeds);
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
    
    $scope.showGistPrompt = function(feed) {
        var message = {
            recipient: "gistModalView",
            feed: feed
        }
       
        window.postMessage(message);
        
        var createGistView = new steroids.views.WebView({
            location: "http://localhost/views/Gist/add.html",
            id: "addGist"
        });

        steroids.modal.show(createGistView);
    }
    
    $scope.loadAllFeeds();
    steroids.view.navigationBar.show("Feed");
}]);

angular.module('gistOfItApp').factory('FeedService',['$http',function($http){
    return {
        parseFeed : function(url){
            return $http.jsonp('https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
        }
    }
}]);

