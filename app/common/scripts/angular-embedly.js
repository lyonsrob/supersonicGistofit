/**
 * Created by moran on 21/06/14.
 */

var angularEmbedly = angular.module('angular-embedly', []);
//service
(function (module) {
    module.provider('embedlyService', function () {
        var key;
        this.setKey = function(userKey) {
            key = userKey;
            return key;
        }
        this.getKey = function() {
            return key;
        }

        function embedly($http) {
            this.embed = function(inputUrl) {
                var escapedUrl = encodeURI(inputUrl);
                var embedlyRequest = 'http://api.embed.ly/1/oembed?key=' + key + '&url=' +  escapedUrl;
                return $http({method: 'GET', url: embedlyRequest});
            };
            this.extract = function(inputUrl, maxWidth, maxHeight) {
                var escapedUrl = encodeURI(inputUrl);
                var embedlyRequest = 'http://api.embed.ly/1/extract?key=' + key + '&url=' +  escapedUrl;

                if (maxWidth > 0 && maxHeight > 0) {
                    embedlyRequest = embedlyRequest + "&image_width=" + maxWidth + "&image_height=" + maxHeight + "&errorUrl=http%3A%2F%2Fmedia.tumblr.com%2Ftumblr_m9e0vfpA7K1qkbsaa.jpg&image_grow=true&image_method=resize";
                } 

                return $http({method: 'GET', url: embedlyRequest});
            };
        }


        this.$get = function($http) {
            return new embedly($http);
        };

    })
//controller
    module.controller('emEmbedCtrl', function($scope) {
        $scope.embedCode = '';
    })
//directive
    module.directive('emEmbed', function(embedlyService) {
        return {
            restrict: 'E',
            scope:{
                urlsearch: '@'
            },
            controller: 'emEmbedCtrl',
            link: function(scope, element) {
                scope.$watch('urlsearch', function(newVal) {
                    var previousEmbedCode = scope.embedCode;
                    if (newVal) {
                        embedlyService.embed(newVal)
                            .then(function(data){
                                switch(data.data.type) {
                                    case 'video':
                                        scope.embedCode = data.data.html;
                                        break;
                                    case 'photo':
                                        scope.embedCode = '<img src="' + data.data.url + '">';
                                        break;
                                    default:
                                        scope.embedCode = '';
                                }
                                if(previousEmbedCode !== scope.embedCode) {
                                    // embed code was changed from last call and has to be replaced in DOM
                                    element.html('<div>' + scope.embedCode + '</div>');
                                }
                            }, function(error) {
                                // promise rejected
                                var previousEmbedCode = scope.embedCode;
                                scope.embedCode = '';
                                if(previousEmbedCode !== scope.embedCode) {
                                    element.html('<div>' + scope.embedCode + '</div>');
                                }
                            });
                    }
                });
            }
        };
    })
})(angularEmbedly);
