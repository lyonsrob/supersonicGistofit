'use strict'

angular.module('gistOfItApp').controller('ProfileCtrl', ['$scope', '$localStorage', 'GistofitService', '$timeout', 
  function ($scope, $localStorage, Gistofit, $timeout) {
    steroids.view.setBackgroundImage({
      image: "/img/background.jpg"
    });
    
    $scope.$storage = $localStorage;

    $scope.logout = function () {
	$scope.facebookLogout();
    	$localStorage.$reset();
    }
    
    $scope.loadInitialView = function () {
    	supersonic.ui.initialView.show();
    }


    if ($scope.$storage.user && $scope.$storage.user.id) {
	    (function refreshGistCount() {
		Gistofit.getUserGistCount($scope.$storage.user.id).then(function(response) {
			$scope.gistCount = response.data;
			$timeout(refreshGistCount, 1000);
		});
	    })();
	    
	    (function refreshLikeCount() {
		Gistofit.getUserGistLikesCount($scope.$storage.user.id).then(function(response) {
			$scope.likeCount = response.data;
			$timeout(refreshLikeCount, 1000);
		});
	    })();
	    
	    (function refreshCommentCount() {
		Gistofit.getUserComments($scope.$storage.user.id).then(function(response) {
			$scope.commentCount = response.data.length;
			$timeout(refreshCommentCount, 1000);
		});
	    })();
    }
    
    steroids.view.navigationBar.show("Me");

    $scope.pushLikes = function() {
	var view = new supersonic.ui.View({
	  location: "Likes#likes",
	  id: "likes"
	});
	supersonic.ui.layers.push(view);		 
    }
    
    $scope.pushComments = function() {
	var view = new supersonic.ui.View({
	  location: "Comments#threads",
	  id: "threads"
	});
	supersonic.ui.layers.push(view);		 
    }

      return $scope.facebookLogout = function() {
        return steroids.addons.facebook.logout().then(function() {
          return $scope.$apply(function() {
            return $scope.loginStatus = false;
          });
        });
      };
}]);
