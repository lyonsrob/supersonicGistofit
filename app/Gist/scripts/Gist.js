'use strict'

angular.module('gistOfItApp').controller('GistCtrl', ['$scope', '$localStorage', 'GistofitService', 
  function ($scope, $localStorage, Gistofit) {
    $scope.$storage = $localStorage;

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
        supersonic.ui.tabs.select(0, {
	  onSuccess:function(data){
	    var message = {
		  recipient: "currentView"
	    }
	       
	    window.postMessage(message);
            steroids.modal.hide();
	  },
	  onFailure:function(error){
	    supersonic.logger.log(error);
	  }
	});
    }

    window.addEventListener("message", $scope.setAddData);

}    
]);
