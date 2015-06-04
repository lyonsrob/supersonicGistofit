'use strict'

function toArrayObj(array) {
    for (var i = 0; i < array.length; ++i)
        array[i] = {link: array[i]};
    return array;
}

angular.module('gistOfItApp').directive('feedCard', function() {
  return {
    restrict: 'E',
    templateUrl: '/templates/feed-card.html'
  };
});

angular.module('gistOfItApp').controller('FeedCtrl', ['$scope', 'GistofitService', 'FeedService', '$q', '$timeout', '$filter', 
  function ($scope, Gistofit, Feed, $q, $timeout, $filter) {
    steroids.view.navigationBar.show("Discover");

    steroids.view.setBackgroundImage({
      image: "/img/background.jpg"
    });
    
    // Create a view
    var feedURLs = [
        'http://feeds2.feedburner.com/Mashable',
        'http://dlisted.com/feed/rdf/',
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

    $scope.feeds = [];

    $scope.loadAllFeeds=function(e){     
        for (var i = 0, len = feedURLs.length; i < len; i++) {
            Feed.parseFeed(feedURLs[i]).then(function(res){
                angular.forEach(res.data.responseData.feed.entries,function(feed, index){
			var myRe = /http:\/\/www\.tmz\.com/g;
			feed.link = myRe.exec(feed.link) ? feed.link.replace(myRe, "http://m.tmz.com") : feed.link; 
			
			var idx = $filter('find')(feed, $scope.feeds);
			if (idx === 1) {
			  res.data.responseData.feed.entries.splice(index,1); 
			  return;
			}

			gaPlugin.trackEvent( nativePluginResultHandler, nativePluginErrorHandler, "Article", "Feed", feed.link, 1);
			Gistofit.getExtract(feed.link).then(function(data) {
			  feed.extract = data;
			  gaPlugin.trackEvent( nativePluginResultHandler, nativePluginErrorHandler, "Provider", "View", data.provider_name, 1);
			});
                });
		
   	 	if (res.data.responseData.feed.entries.length > 0) {
			$scope.feeds.unshift.apply($scope.feeds, res.data.responseData.feed.entries);
		} 
            });
        }
    }
  
   document.addEventListener("deviceready", function() {
	document.addEventListener("resume", onResume, false);
   });
   
   function onResume() {
	$scope.$apply(function() {
	   $scope.status = "loading";
	});
	document.getElementsByClassName("pull-to-refresh")[0].classList.add("no-margin");
   	$scope.loadAllFeeds();
	document.getElementsByClassName("pull-to-refresh")[0].classList.remove("no-margin");
   }

   $scope.loadAllFeeds();
 
   $scope.openURL = function(feed, index) {
	var url = feed.extract.url; 

	gaPlugin.trackEvent( nativePluginResultHandler, nativePluginErrorHandler, "Article", "View", url, 1);
        //var ref = window.open(url, '_blank', 'location=yes');
	$scope.themeable = cordova.ThemeableBrowser.open(url, '_blank', {
	    statusbar: {
		color: '#ffffffff'
	    },
	    toolbar: {
		height: 44,
		color: '#f0f0f0ff'
	    },
	    title: {
		color: '#003264ff',
		showPageTitle: true
	    },
	    backButton: {
		image: 'back',
		imagePressed: 'back_pressed',
		align: 'left',
		event: 'backPressed'
	    },
	    forwardButton: {
		image: 'forward',
		imagePressed: 'forward_pressed',
		align: 'left',
		event: 'forwardPressed'
	    },
	    closeButton: {
		image: 'close',
		imagePressed: 'close_pressed',
		align: 'left',
		event: 'closePressed'
	    },
	    customButtons: [
		{
		    image: 'share',
		    imagePressed: 'share_pressed',
		    align: 'right',
		    event: 'sharePressed'
		}
	    ],
/*
	    menu: {
		image: 'menu',
		imagePressed: 'menu_pressed',
		title: 'Test',
		cancel: 'Cancel',
		align: 'right',
		items: [
		    {
			event: 'helloPressed',
			label: 'Hello World!'
		    },
		    {
			event: 'testPressed',
			label: 'Test!'
		    }
		]
	    },
*/
	    backButtonCanClose: true
	}).addEventListener('backPressed', function(e) {
//	    alert('back pressed');
	}).addEventListener('helloPressed', function(e) {
//	    alert('hello pressed');
	}).addEventListener('sharePressed', function(e) {
	    $scope.themeable.close();
	    $scope.showGistPrompt(feed, index);
	});
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

    $scope.onReload = function() {
	var deferred = $q.defer();
	setTimeout(function() {
		$scope.loadAllFeeds();
		deferred.resolve(true);
	}, 500);
	return deferred.promise;
     };

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
  
