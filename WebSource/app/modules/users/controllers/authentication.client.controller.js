(function() {
'use strict';

angular.module('users')
.controller('AuthenticationController', ['$scope', 'Authentication', '$location',
	function($scope, Authentication, $location) {
		// The model for this form
  		$scope.user = {};

  		$scope.alerts = [];

		$scope.addAlert = function(msg) {
			$scope.alerts.push({type:'danger', msg: msg});
		};

		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};

		$scope.login = function() {
			Authentication.login($scope.user);
		};
	}
]);
})();
