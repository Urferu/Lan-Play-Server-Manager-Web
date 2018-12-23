(function() {
    'use strict';

    var server_manager = angular.module('server_manager', ['GGrid', 'oc.lazyLoad', 'angular-growl']);

    angular.module('server_manager').directive('myEnterParametros', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.myEnterParametros);
                    });
    
                    event.preventDefault();
                }
            });
        };
    });

    server_manager.config(server_managerConfig);

    server_managerConfig.$inject = ['$stateProvider', 'Config'];

    function server_managerConfig($stateProvider, Config) {
        var service = 'server_manager.service.js';
        var serviceCss = 'flags.css';

        var states = [
            {//Cuando no sirva el testlogin
                state: 'app.server_manager',
                url: '/server_manager',
                controller: 'serverManagerController',
                as: 'vmManager',
                view: 'server_manager.view.html',
                controllerJs: 'server_manager.controller.js',
                ncyBreadcrumb: 'Lan Play Server Manager'
            }
        ];

        angular.forEach(states, function(state, key) {
            var viewsPoner = {
                'content@app': {
                    controller: state.controller,
                    controllerAs: state.as,
                    templateUrl: Config.routes.modules + '/server_manager/views/' + state.view
                }
            };
            var filesPoner = [
                Config.routes.modules + '/server_manager/css/' + serviceCss,
                Config.routes.modules + '/server_manager/controllers/' + state.controllerJs,
                Config.routes.modules + '/server_manager/services/' + service
            ];
            $stateProvider.state(state.state, {
                url: state.url,
                views: viewsPoner,
                resolve: {
                    lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: filesPoner
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
