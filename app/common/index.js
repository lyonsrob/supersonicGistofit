angular.module('gistOfItApp', [
'supersonic',
'angular-embedly',
'ngTouch',
'ngStorage',
'infinite-scroll'
])
.config(function(embedlyServiceProvider){
        embedlyServiceProvider.setKey('42f4925174814d68b90d0758d932fe14');
})
.filter('domain', function() {
  return function(url) {
   var matches,
        output = "",
        urls = /\w+:\/\/([\w|\.]+)/;

    matches = urls.exec( url );

    if ( matches !== null ) output = matches[1];

    return output; 
  };
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

steroids.view.setBackgroundImage({
  image: "/img/background.jpg"
});

    
// Search view
var searchView = new steroids.views.WebView({
    location: "http://localhost/views/Search/search.html",
    id: "search"
});
   
var searchButton = new steroids.buttons.NavigationBarButton();
searchButton.imagePath = "/icons/search@2x.png";

steroids.logger.log("Setting up onTap for searchButton");

searchButton.onTap = function() { 
    var fastSlide = new steroids.Animation({  transition: "slideFromRight",  duration: .2});

    // Navigate to your view
    steroids.layers.push(
    {
        view: searchView,
        animation: fastSlide
    });
};

steroids.view.navigationBar.update({
    overrideBackButton: false,
    buttons: {
      right: [searchButton]
    }
});

