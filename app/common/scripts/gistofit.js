// The contents of individual model .js files will be concatenated into dist/models.js

/*
(function(){
// Protects views where AngularJS is not loaded from errors
if ( typeof angular == 'undefined' ) {
	return;
};
*/

angular.module("gistOfItApp").factory('GistofitService', ['$http', 'embedlyService', function ($http, Embedly) {
    //var baseURL = 'http://127.0.0.1:8008/rest/v1';
    //var baseURL = 'http://127.0.0.1:8080/rest/v1';
    var baseURL = 'https://erudite-flag-623.appspot.com/rest/v1';

    function buildURL (method) {
        return baseURL + method;
    }
    var Gistofit = function() {
   	this.busy = false; 
    };
    
    Gistofit.getGist = function (id) {i
        var url = buildURL('/gist/' + id); 
        return $http({method: 'GET', url: url});
    };
    
    Gistofit.getUser = function (id) {
        var url = buildURL('/user/' + id); 
        return $http({method: 'GET', url: url});
    };
    
    Gistofit.createUser = function (data) {
        var url = buildURL('/user'); 
        return $http({method: 'POST', url: url, data: data});
    };
    
    Gistofit.getUserGistCount = function (id) {
        var url = buildURL('/user/' + id + '/gists/count'); 
        return $http({method: 'GET', url: url});
    };
    
    Gistofit.getUserGists = function (id) {
        var url = buildURL('/user/' + id + '/gists'); 
        return $http({method: 'GET', url: url});
    };

    Gistofit.getUserGistLikesCount = function (id) {
        var url = buildURL('/user/' + id + '/gists/likes/count'); 
        return $http({method: 'GET', url: url});
    };
    
    Gistofit.getUserGistLikes = function (id) {
        var url = buildURL('/user/' + id + '/gists/likes'); 
        return $http({method: 'GET', url: url});
    };
    
    Gistofit.getUserComments = function (id) {
        var url = buildURL('/user/' + id + '/comments'); 
        return $http({method: 'GET', url: url});
    };

    Gistofit.getNewest = function (id) {
        var url = buildURL('/gist/newest');
        return $http({method: 'GET', url: url, params: {last_seen: id}});
    };
    Gistofit.getRecent = function (cursor) {
        var url = buildURL('/gist/recent');
        return $http({method: 'GET', url: url, params: {cursor: cursor}});
    };
    Gistofit.getTrending = function (cursor) {
        var url = buildURL('/gist/trending');
        return $http({method: 'GET', url: url});
    };
    Gistofit.getExtract = function (url) {
        var escapedUrl = encodeURIComponent(url);
        var extractUrl = buildURL('/url/'+ escapedUrl + '/extract');

        return $http({method: 'GET', url: extractUrl}).then(function (response) {
            var data = response.data;
            if (response.data == undefined || response.data == '') {
                return Embedly.extract(url).then(function(e){
                    Gistofit.setExtract(url, e.data);
		    return e.data;
                },
                 function(error) {
                    console.log(error);
                 });
            }

	    return data;  
        });
    };
    Gistofit.setExtract = function (inputUrl, data) {
        var escapedUrl = encodeURIComponent(inputUrl);
        var url = buildURL('/url/'+ escapedUrl + '/extract'); 
        return $http({method: 'POST', url: url, data: data, headers: {'Content-Type': 'text/plain'}});
    };
    Gistofit.addGist = function (inputUrl, content, userId) {
        url = buildURL ('/gist/url/' + encodeURIComponent(inputUrl));
        var data = {'content': content, 'userId': userId};
        return $http({method: 'POST', url: url, data: data});
        //return $http({method: 'POST', url: url, data: data, withCredentials: true});
    };
    Gistofit.deleteGist = function (id) {
        url = buildURL ('/gist/' + id);
        return $http({method: 'DELETE', url: url, data: {}, headers: {'Content-Type': 'application/json'}});
        //return $http({method: 'POST', url: url, data: data, withCredentials: true});
    };
    Gistofit.likeGist = function (id, user) {
        url = buildURL ('/gist/' + id  + '/likes');
        return $http.post(url, {userid: user.id });
    };
    Gistofit.getLikes = function (id) {
        url = buildURL ('/gist/' + id  + '/likes');
        return $http.get(url);
    };
    Gistofit.commentGist = function (id, content, user) {
        url = buildURL ('/gist/' + id + '/comments');
        return $http.post(url, {content: content, userid: user.id});
    };
    Gistofit.getComments = function (id) {
        url = buildURL ('/gist/' + id + '/comments');
        return $http({method: 'GET', url: url});
    };
    Gistofit.searchTopUrls = function (query) {
        var url = buildURL('/search/top/urls/?keyword=' + query); 
        return $http({method: 'GET', url: url});
    };
    
    return Gistofit; 
}]);
