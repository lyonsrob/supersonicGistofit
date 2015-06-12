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

    var pushNotification;
    var pushwoosh; 
 
    document.addEventListener("deviceready", function() {
       pushNotification = window.plugins.pushNotification;
       pushwoosh = window.plugins.pushwoosh;
    
       function errorHandler (error) {
            supersonic.logger.log(error);
       }

       function registrationHandler (deviceToken) {
            supersonic.logger.log(deviceToken);
	    //save the deviceToken / registration ID to your Push Notification Server
       } 

       pushwoosh.onDeviceReady({pw_appid:"77A1C-B825E"});

       pushNotification.register(
		    registrationHandler,
		    errorHandler, {
		    //android options
		    "senderID":"501778584039",
		    //ios options
		    "badge":"true",
		    "sound":"true",
		    "alert":"true"
		    });

       pushwoosh.registerDevice(
        function(status) {
            var deviceToken = status['deviceToken'];
            console.warn('registerDevice: ' + deviceToken);
        },
        function(status) {
            console.warn('failed to register : ' + JSON.stringify(status));
	    setTimeout(function(){ alert(JSON.stringify(['failed to register ', status])); }, 1);
        }
      ); 
    }); 
    
    $scope.checkLoginStatus = function() { 
    }

    $scope.dismissLogin = function() {
	steroids.initialView.dismiss({
		animation: dismissAnimation
	});
    
    }

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
							supersonic.ui.initialView.dismiss()
							return $scope.loginStatus = true;
						});
					});
			});
      	};
      
     $scope.emailSignUp = function() 
	{
		return Gistofit.createUser({first_name: $scope.first_name, last_name: $scope.last_name, email: $scope.email, password: $scope.password}).then(function(e) 		 	{
				$scope.$storage.user = e.data;
				
				return $scope.$apply(function() {
						supersonic.ui.initialView.dismiss()
						return $scope.loginStatus = true;
				});
		  });
      	};
      
      $scope.facebookLogout = function() {
        return steroids.addons.facebook.logout().then(function() {
          return $scope.$apply(function() {
	    delete $scope.$storage.user;
            return $scope.loginStatus = false;
          });
        });
      };
    
    $scope.addonsUndefined = steroids.addons === void 0;
    if (!$scope.addonsUndefined) {
      $scope.ready = false;
      $scope.loginStatus = false;
      $scope.firstName = "Not fetched yet.";

      steroids.addons.facebook.ready.then(function() {
        $scope.ready = true;
        return steroids.addons.facebook.getLoginStatus().then(function(response) {
          return $scope.$apply(function() {
            if ($scope.loginStatus = response.status === 'connected') {
		return steroids.initialView.dismiss({
			animation: dismissAnimation
		});
	    }
          });
        });
      });
    }
}]);
