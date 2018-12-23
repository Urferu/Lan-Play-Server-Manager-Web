(function() {
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider', 'localStorageServiceProvider',
	function($httpProvider,localStorageServiceProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push('RequestsInterceptor');
        localStorageServiceProvider.setStorageType('sessionStorage');
	}
]);
})();
