angular.module("gistOfItApp").directive('openThemeableBrowser', function() {
  return {
    scope: {
    	feed: '=',
    	url: '@',
    	index: '@'
    },
    link: function(scope, element, attrs)
    {
      console.log(scope);
      console.log(element);
      console.log(attrs);
 
    scope.showGistPrompt = function(feed, index) {
	scope.selectedFeed = index;
 
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

     scope.openUrl = function() {
	gaPlugin.trackEvent( nativePluginResultHandler, nativePluginErrorHandler, "Article", "View", scope.url, 1);
        //var ref = window.open(scope.url, '_blank', 'location=yes');
	scope.themeable = cordova.ThemeableBrowser.open(scope.url, '_blank', {
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
	    scope.themeable.close();
	    scope.showGistPrompt(scope.feed, scope.index);
	});
    }

    element.bind('click', scope.openUrl); 
    }
  };
})

