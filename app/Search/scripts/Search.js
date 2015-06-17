'use strict'

function toArrayObj(array) {
 for (var i = 0; i < array.length; ++i)
     array[i] = {url: array[i], extract: {}};
 return array;
}

angular.module('gistOfItApp').directive('searchCard', function() {
  return {
    restrict: 'E',
    templateUrl: '/templates/search-card.html'
  };
});

angular.module('gistOfItApp').controller('SearchCtrl', ['$scope', 'GistofitService', '$timeout', 
  function ($scope, Gistofit, $timeout) {
    steroids.view.setBackgroundImage({
      image: "/img/background.jpg"
    });
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
						$timeout(refreshGistCountForURL, 30000);
					});
				})();
			});
		    });
		 });
	}
    });

    window.addEventListener("message", $scope.setAddData);

}]);
