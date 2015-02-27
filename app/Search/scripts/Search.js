'use strict'

function toArrayObj(array) {
 for (var i = 0; i < array.length; ++i)
     array[i] = {url: array[i], extract: {}};
 return array;
}

angular.module('gistOfItApp').controller('SearchCtrl', ['$scope', 'GistofitService', 
  function ($scope, Gistofit) {

    $scope.$watch('search', function (value) {
        Gistofit.searchTopUrls(value).then(function (response) {
            $scope.results = toArrayObj(response.data);
            var promises = []; 

            angular.forEach($scope.results,function(result){
               Gistofit.getExtract(result, result.url).then(function(data) {
                        result.extract = data;
                });
            });
         });
    });

    window.addEventListener("message", $scope.setAddData);
    steroids.view.navigationBar.show("Search");

}]);
