'use strict'

angular.module('gistOfItApp').controller('CommentsCtrl', ['$scope', 'supersonic', '$localStorage', 'GistofitService', 
  function ($scope, supersonic, $localStorage, Gistofit) {
    $scope.comment_gist = null;
    supersonic.bind($scope, "comment_gist");

    $scope.$storage = $localStorage;
     
    document.addEventListener("visibilitychange", loadComments, false);
    
    function loadComments () {
	$scope.comments = {};
	Gistofit.getComments($scope.comment_gist).then(function (response) {
	$scope.comments = response.data;
      });
    }
    
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

    steroids.logger.log('loading comments!');
    
    window.addEventListener("message", $scope.loadCommentsFromEvent);
    
    steroids.view.navigationBar.update({
        buttons: {
            left: [],
            right: [],
        }
    });

}]);
