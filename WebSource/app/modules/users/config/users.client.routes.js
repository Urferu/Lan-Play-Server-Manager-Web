(function() {
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider', 'Config',
    function($stateProvider, Config) {
        // Users state routing
        $stateProvider.
        state('login', {
            url: '/login',
            views:{
                root:{
                    templateUrl: Config.routes.modules + '/users/views/login.client.view.html'
                }
            }
            
        });
    }
]);
})();