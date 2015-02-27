'use strict'

angular.module('gistOfItApp').controller('LoginCtrl', ['$scope', '$localStorage', 'supersonic', 'GistofitService', 
  function ($scope, $localStorage, supersonic, Gistofit) {

    $scope.$storage = $localStorage.$default({
    	user: {}
    });
            
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
							var dismissAnimation = new steroids.Animation({
								transition: "flipHorizontalFromRight",
								duration: 1.0,
								curve: "easeInOut"
							});

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
            return $scope.loginStatus = false;
          });
        });
      };
    }
}]);
