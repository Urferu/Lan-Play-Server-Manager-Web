(function() {
    'use strict';

    var generales = angular.module('generales', ['GGrid', 'oc.lazyLoad', 'angular-growl']);

    generales.config(GeneralesConfig);

    GeneralesConfig.$inject = ['$stateProvider', 'Config'];

    function GeneralesConfig($stateProvider, Config) {
        var service = 'generales.general.service.js';

        var states = [
        ];


        angular.forEach(states, function(state, key) {
            $stateProvider.state(state.state, {
                url: state.url,
                views: {
                    'content@app': {
                        controller: state.controller,
                        controllerAs: state.as,
                        templateUrl: Config.routes.modules + '/generales/views/' + state.view
                    }
                },
                resolve: {
                    lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                Config.routes.modules + '/generales/services/' + service
                            ]
                        }]);
                    }]
                },
                ncyBreadcrumb: {
                    label: state.ncyBreadcrumb
                }
            });
        });
    }
})();
