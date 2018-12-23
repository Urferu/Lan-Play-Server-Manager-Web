'use strict';

angular.module('users')
.service('RequestsInterceptor',['$q', '$location', 'localStorageService', function($q, $location, localStorage) {
	var UNAUTHORIZED_CODE = 401,
	FORBIDDEN_CODE = 403,
	accessToken;

	this.request = function(config) {
		accessToken = localStorage.get('access_token');

		if(accessToken) config.headers.Authorization = accessToken;

		return config;
	};

	this.responseError = function(rejection) {
		switch(rejection.status) {
			case UNAUTHORIZED_CODE:
				localStorage.remove('user', 'access_token');
				$location.path('/login');
				break;
			case FORBIDDEN_CODE:
				// TODO: Add forbidden behaviour or delete
				break;
		}

		return $q.reject(rejection);
	};
}]);