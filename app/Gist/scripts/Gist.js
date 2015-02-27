'use strict'

angular.module('gistOfItApp').controller('GistCtrl', ['$scope', '$localStorage', 'GistofitService', 
  function ($scope, $localStorage, Gistofit) {
    $scope.$storage = $localStorage;
    function messageReceived(event) {

      // check that the message is intended for us
      if (event.data.sender == "loginView") {
    	$scope.userId = event.userId;
        alert(event.data.message)
      }
    }

    window.addEventListener("message", messageReceived);

    $scope.setAddData = function(event) {
        if (event.data.recipient == "gistModalView") {
            $scope.gist = "";
            $scope.extract = event.data.feed.extract;
            $scope.url = event.data.feed.extract.url;
            $scope.$apply();
        }
    }
    
    $scope.addGist = function(gist) {
        Gistofit.addGist($scope.url, gist, $scope.$storage.user.id);
        steroids.modal.hide();
    }

    window.addEventListener("message", $scope.setAddData);

}    
]);
