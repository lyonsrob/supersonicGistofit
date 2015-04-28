'use strict'

function toArrayObj(array) {
 for (var i = 0; i < array.length; ++i)
     array[i] = {url: array[i], extract: {}};
 return array;
}

angular.module('gistOfItApp').controller('SearchCtrl', ['$scope', 'GistofitService', '$timeout', 
  function ($scope, Gistofit, $timeout) {
    $scope.$watch('search', function (value) {
	if(value && value.length > 2) {
		Gistofit.searchTopUrls(value).then(function (response) {
		    $scope.results = toArrayObj(response.data);

		    angular.forEach($scope.results,function(result){
		       Gistofit.getExtract(result.url).then(function(data) {
				result.extract = data;
				(function refreshGistCountForURL() {
					Gistofit.getGistsCountForURL(result.url).then(function(response) {
						result.gist_count = response.data;
						//$timeout(refreshGistCountForURL, 1000);
					});
				})();
			});
		    });
		 });
	}
    });

    window.addEventListener("message", $scope.setAddData);
    steroids.view.navigationBar.show("Search");

}]);
