'use strict'

angular.module('gistOfItApp').controller('CommentsCtrl', ['$scope', 'GistofitService', 
  function ($scope, Gistofit) {
    $scope.comments = {};
    $scope.loadCommentsFromEvent = function (event) {
        if (event.data.recipient == "commentsView") {
            $scope.id = event.data.id;
            Gistofit.getComments($scope.id).then(function (response) {
                $scope.comments = response.data;
              });
              $scope.$apply();
        }
    };
    
    $scope.add = function () {
        var content = $scope.content;
        var id = $scope.id;
        var url = $scope.url;

        if (content != '') {
        	Gistofit.commentGist(id, content, user).then(function () {
		    Gistofit.getComments($scope.id).then(function (response) {
			$scope.comments = response.data;
		    });
		    $scope.$apply();
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
