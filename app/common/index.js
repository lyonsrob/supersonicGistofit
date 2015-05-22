angular.module('gistOfItApp', [
'supersonic',
'angular-embedly',
'ngTouch',
'ngStorage',
'mgcrea.pullToRefresh',
'angularMoment'
])
.run(function() {
    FastClick.attach(document.body);
})
.constant('pullToRefreshConfig', {
    treshold: 30,
    debounce: 400,
    text: {
      pull: 'pull to refresh',
      release: 'release to refresh',
      loading: 'refreshing...'
    },
    icon: {
      pull: 'super-arrow-down-a',
      release: 'super-arrow-up-a',
      loading: 'super-load-c'
    }
})
.config(function(embedlyServiceProvider){
        embedlyServiceProvider.setKey('42f4925174814d68b90d0758d932fe14');
})
.filter('find', function(){
  return function(feed, feeds) {
    for (var index in feeds) {
      if (feeds[index].link == feed.link) {
        return 1;
      }
    }
    return 0;
  }
})
.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
	filtered.push(item);
    });
    filtered.sort(function (a, b) {
      if(a[field] > b[field]) return 1;
      if(a[field] < b[field]) return -1;
      return 0;
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
})
.directive('ngTap', function() {
  return function(scope, element, attrs) {
    var tapping;
    tapping = false;
    element.bind('touchstart', function(e) {
      element.addClass('active');
      tapping = true;
    });
    element.bind('touchmove', function(e) {
      element.removeClass('active');
      tapping = false;
    });
    element.bind('touchend', function(e) {
      element.removeClass('active');
      if (tapping) {
        scope.$apply(attrs['ngTap'], element);
      }
    });
  };
});

steroids.on('ready', function() {
    steroids.statusBar.onTap(
      function() {
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
        }
    );
});

steroids.logger.log(steroids.view.location);

var searchButton = new steroids.buttons.NavigationBarButton();
searchButton.imagePath = "/icons/search@2x.png";

steroids.logger.log("Setting up onTap for searchButton");

searchButton.onTap = function() { 
	supersonic.ui.views.find("search").then( function(startedView) {
	  supersonic.ui.layers.push(startedView);
	});
};

steroids.view.navigationBar.update({
    overrideBackButton: false,
    buttons: {
      right: [searchButton]
    }
});

document.addEventListener("deviceready", onDeviceReady, false);

var gaPlugin = {
	    "trackPage": function () {
	    },
	    "trackEvent": function () {
	    }
	};

function onDeviceReady() {
    if (window.plugins.gaPlugin) {
      gaPlugin = window.plugins.gaPlugin;
      gaPlugin.init(successHandler, errorHandler, "UA-53420229-1", 10);
    }
}

supersonic.ui.views.current.whenVisible( function() { 
    gaPlugin.trackPage( nativePluginResultHandler, nativePluginErrorHandler, steroids.view.location);    
});

function nativePluginResultHandler() {
    return; 
}

function nativePluginErrorHandler() {
    return; 
}

function successHandler() {
    return; 
}
function errorHandler() {
    return; 
}
