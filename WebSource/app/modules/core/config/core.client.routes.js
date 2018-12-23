(function() {
'use strict';

// Setting up route
angular.module('core', [ 'oc.lazyLoad' ]).config(['$stateProvider', '$urlRouterProvider', 'markedProvider', '$provide','blockUIConfig', '$httpProvider', 'growlProvider', 'Config',
	function($stateProvider, $urlRouterProvider, markedProvider, $provide, blockUIConfig, $httpProvider, growlProvider, Config) {
        
		    //Decorators datepicker - accordion    //
        $provide.decorator('uibAccordionDirective', function($delegate) {
          var directive = $delegate[0];
          directive.templateUrl = Config.routes.modules + '/core/views/templates/accordionAce.html';
          return $delegate;
        });
        $provide.decorator('uibAccordionGroupDirective', function($delegate) {
          var directive = $delegate[0];
          directive.templateUrl = Config.routes.modules + '/core/views/templates/accordiongroup.html';
          return $delegate;
        });

        $provide.decorator('uibDaypickerDirective', function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = Config.routes.modules + '/core/views/templates/day.html';
            return $delegate;
        });
        $provide.decorator('uibDatepickerPopupWrapDirective', function($delegate) {
        var directive = $delegate[0];
            directive.templateUrl = Config.routes.modules + '/core/views/templates/popup.html';
            return $delegate;
        });
        $provide.decorator('uibYearpickerDirective', function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = Config.routes.modules + '/core/views/templates/year.html';
            return $delegate;
        });
        $provide.decorator('uibMonthpickerDirective', function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = Config.routes.modules + '/core/views/templates/month.html';
            return $delegate;
        });

		$httpProvider.defaults.useXDomain = true;
		$httpProvider.defaults.headers.common = 'Content-Type: application/json';
		delete $httpProvider.defaults.headers.common['X-Requested-With'];

		growlProvider.globalDisableCountDown(true);

    //BLOCK UI
    blockUIConfig.message = 'Cargando, espere porfavor...';
    blockUIConfig.autoBlock = false;
    blockUIConfig.delay = 0;
    blockUIConfig.template = '<div class="block-ui-overlay"></div><div class="block-ui-message-container" aria-live="assertive" aria-atomic="true"><div class="block-ui-message" ng-class=\"$_blockUiMessageClass\"><i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i> {{ state.message }}</div></div>';

        // Redirect to home view when route not found
		//$urlRouterProvider.otherwise('/');
        //
        $urlRouterProvider.otherwise(function ($injector) {
          var $state = $injector.get('$state');
          $state.go('app.server_manager');
        });

		// Home state routing
		$stateProvider
        .state('app', {
            abstract: true,
            views: {
                root: {
                    controller:'CoreController',
                    controllerAs:'vmCore',
                    templateUrl: Config.routes.modules + '/core/views/core.client.view.html'
                }
            }
        })
        .state('app.home', {
            url:'/',
		        views: {
			         'content@app': {
                    controller:'HomeController',
                    controllerAs:'vmHome',
                    templateUrl: Config.routes.modules + '/core/views/home.client.view.html'
			         }
		        },
            ncyBreadcrumb: {
		            label: 'Home' // angular-breadcrumb's configuration
		        }
        });
	}
]);
})();
