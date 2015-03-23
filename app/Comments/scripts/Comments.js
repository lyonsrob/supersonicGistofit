'use strict'

angular.module('gistOfItApp').controller('CommentsCtrl', ['$scope', 'supersonic', '$localStorage', 'GistofitService', 
  function ($scope, supersonic, $localStorage, Gistofit) {

    $scope.$storage = $localStorage;

    supersonic.data.channel('load_comments').subscribe( function(message) {
	$scope.content = '';
	$scope.gist_id = message.gistId;
	Gistofit.getComments($scope.gist_id).then(function (response) {
	    $scope.comments = response.data;
     	    angular.forEach($scope.comments, function(comment) {
	    	Gistofit.getUser(comment.user.key.raw.id).then(function (response) {
			angular.extend(comment.user, response.data);
		});
	    });
	});
    });   

    $scope.add = function () {
        var content = $scope.content;
        
	if (content != '') {
        	Gistofit.commentGist($scope.gist_id, content, $scope.$storage.user).then(function () {
		    Gistofit.getComments($scope.gist_id).then(function (response) {
			$scope.comments = response.data;
			    angular.forEach($scope.comments, function(comment) {
				Gistofit.getUser(comment.user.key.raw.id).then(function (response) {
					angular.extend(comment.user, response.data);
				});
	    });
			$scope.content = '';
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
