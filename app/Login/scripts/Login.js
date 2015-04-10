'use strict'

angular.module('gistOfItApp').controller('LoginCtrl', ['$scope', '$localStorage', 'GistofitService', 
  function ($scope, $localStorage, Gistofit) {
    var dismissAnimation = new steroids.Animation({
	transition: "flipHorizontalFromRight",
	duration: 1.0,
	curve: "easeInOut"
    });

    $scope.$storage = $localStorage.$default({
    	user: {}
    });
    
    if ($scope.$storage.user.id) {
	steroids.initialView.dismiss({
		animation: dismissAnimation
    	});
    }
  
    var pushNotification;
   
    document.addEventListener("deviceready", function() {
       pushNotification = window.plugins.pushNotification;
    
       function errorHandler (error) {
            supersonic.logger.log(error);
       }

       function registrationHandler (deviceToken) {
            supersonic.logger.log(deviceToken);
	    //save the deviceToken / registration ID to your Push Notification Server
       } 

       pushNotification.register(
		    registrationHandler,
		    errorHandler, {
		    //android options
		    "senderID":"1234567891011",
		    //ios options
		    "badge":"true",
		    "sound":"true",
		    "alert":"true"
		    }); 
    }); 
   
    $scope.checkLoginStatus = function() { 
    }
 
    $scope.dismissLogin = function() {
	steroids.initialView.dismiss({
		animation: dismissAnimation
	});
    
    }
 
    $scope.addonsUndefined = steroids.addons === void 0;
    if (!$scope.addonsUndefined) {
      $scope.ready = false;
      $scope.loginStatus = false;
      $scope.firstName = "Not fetched yet.";

      steroids.addons.facebook.ready.then(function() {
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
						steroids.addons.facebook.getAccessToken().then(function(token) {
							$scope.$storage.accessToken = token;
						});

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
      
      return $scope.facebookLogout = function() {
        return steroids.addons.facebook.logout().then(function() {
          return $scope.$apply(function() {
	    delete $scope.$storage.user;
            return $scope.loginStatus = false;
          });
        });
      };
    }
}]);
