'use strict'

angular.module('gistOfItApp').controller('CommentsCtrl', ['$scope', 'supersonic', '$localStorage', 'GistofitService', 
  function ($scope, supersonic, $localStorage, Gistofit) {
    $scope.comment_gist = null;
    supersonic.bind($scope, "comment_gist");

    $scope.$storage = $localStorage;
     
    function loadComments () {
	$scope.comments = {};
	Gistofit.getComments($scope.comment_gist).then(function (response) {
	$scope.comments = response.data;
      });
    }
    
    document.addEventListener("visibilitychange", loadComments, false);
    
    $scope.add = function () {
        var content = $scope.content;
        
	if (content != '') {
        	Gistofit.commentGist($scope.comment_gist, content, $scope.$storage.user).then(function () {
		    Gistofit.getComments($scope.comment_gist).then(function (response) {
			$scope.comments = response.data;
		    });
		});
        }
    }

    steroids.view.navigationBar.update({
        buttons: {
            left: [],
            right: [],
        }
    });

}]);
