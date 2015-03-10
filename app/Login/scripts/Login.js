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
	
        return steroids.addons.facebook.login(['public_profile']).then(function() 	   
	{
		steroids.initialView.dismiss({
	  		animation: dismissAnimation
		});
    	});
    }
   
    $scope.addonsUndefined = steroids.addons === void 0;
    if (!$scope.addonsUndefined) {
      $scope.ready = false;
      $scope.loginStatus = false;
      $scope.firstName = "Not fetched yet.";
      
      $scope.facebookLogin = function() 
	{
        	return steroids.addons.facebook.login(['public_profile', 'email', 'user_likes', 'user_location', 'user_interests', 'user_education_history']).then(function() 	   
			{
				return steroids.addons.facebook.api('/me', {fields: 'email, first_name, last_name'}).then(function(user) 
					{
						Gistofit.createUser(user).then(function(e) {
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
