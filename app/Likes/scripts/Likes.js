'use strict'

angular.module('gistOfItApp').controller('LikesCtrl', ['$scope', '$localStorage', 'GistofitService', 
  function ($scope, $localStorage, Gistofit) {
    steroids.view.navigationBar.show("Likes");
    $scope.$storage = $localStorage;

    $scope.gists = {};

    Gistofit.getUserGists($scope.$storage.user.id).then(function (response) {
	    $scope.gists = response.data;
 
	    angular.forEach($scope.gists,function(gist) {
		    Gistofit.getExtract(gist.url.key.raw.name).then(function(data) {
			    gist.extract = data;
		    });
		    Gistofit.getLikes(gist.id).then(function(response) {
			    gist.likes = response.data.map;
		    });
	    });

	    $scope.cursor = response.data.nextCursor; 
	    $scope.userServiceInfo = response.data.userServiceInfo;
	    $scope.last_seen = response.data.lastSeen;
     });
   
}]);
