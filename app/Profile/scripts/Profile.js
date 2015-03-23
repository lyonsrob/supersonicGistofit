'use strict'

angular.module('gistOfItApp').controller('ProfileCtrl', ['$scope', '$localStorage', 'GistofitService', '$timeout', 
  function ($scope, $localStorage, Gistofit, $timeout) {
    
    $scope.$storage = $localStorage;

    $scope.logout = function () {
	$scope.facebookLogout();
    	$localStorage.$reset();
    }


    if ($scope.$storage.user.id) {
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
    
    steroids.view.navigationBar.show("Profile");

    $scope.pushLikes = function() {
	var view = new supersonic.ui.View({
	  location: "Likes#likes",
	  id: "likes"
	});
	supersonic.ui.layers.push(view);		 
    }

    $scope.addonsUndefined = steroids.addons === void 0;
    if (!$scope.addonsUndefined) {
      $scope.ready = false;
      $scope.loginStatus = false;
      $scope.firstName = "Not fetched yet.";
      steroids.addons.facebook.ready.then(function() {
        $scope.$apply(function() {
          return $scope.ready = true;
        });
        return steroids.addons.facebook.getLoginStatus().then(function(response) {
          return $scope.$apply(function() {
            if ($scope.loginStatus = response.status === 'connected') {
	    	return $scope.facebookGraphQuery();
	    }
          });
        });
      });
      $scope.facebookLogin = function() 
	{
        	return steroids.addons.facebook.login(['public_profile', 'email', 'user_likes', 'user_location', 'user_interests', 'user_education_history']).then(function() 	   
			{
				return steroids.addons.facebook.api('/me', {fields: 'email, first_name, last_name, picture.type(normal), likes' }).then(function(user) 
					{
						Gistofit.createUser({id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, profile_picture: user.picture.data.url}).then(function(e) {
							$scope.$storage.user = e.data;
						});
					
						return $scope.$apply(function() {
							steroids.initialView.dismiss({
							  animation: dismissAnimation
							});
						
							return $scope.loginStatus = true;
						});
					});
			});
      	};
     $scope.facebookGraphQuery = function() {
        return steroids.addons.facebook.api('/me', {
          fields: 'first_name, last_name, picture.type(normal)'
        }).then(function(response) {
          return $scope.$apply(function() {
            $scope.firstName = response.first_name;
            $scope.lastName = response.last_name;
            $scope.profilePicture = response.picture.data.url;
	    return;
          });
        });
      };
      
      return $scope.facebookLogout = function() {
        return steroids.addons.facebook.logout().then(function() {
          return $scope.$apply(function() {
            return $scope.loginStatus = false;
          });
        });
      };
    }
}]);
