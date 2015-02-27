'use strict'

angular.module('gistOfItApp').controller('ArticleCtrl', ['$scope', 'GistofitService', 'embedlyService', 
  function ($scope, Gistofit, Embedly) {
    $scope.article = {};
    $scope.loadArticle = function (event) {
        if (event.data.recipient == "articleView") {
            var target = $(".content");
         
            //disable touch scroll to kill existing inertial movement
            target.css({
                '-webkit-overflow-scrolling' : 'auto',
                'overflow-y' : 'hidden'
            });
         
            //animate
            target.animate({ scrollTop: 0}, 300, "swing", function(){
         
                //re-enable touch scrolling
                target.css({
                    '-webkit-overflow-scrolling' : 'touch',
                    'overflow-y' : 'scroll'
                });
            });
            $scope.article = event.data.article;
            $scope.$apply();
        }
    };

    steroids.logger.log('loading article!');
    window.addEventListener("message", $scope.loadArticle);

    steroids.view.navigationBar.update({
        buttons: {
            left: [],
            right: [],
        }
    });
}]);
