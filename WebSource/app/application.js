(function() {
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName,
ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  '$breadcrumbProvider',
  '$httpProvider',
  'growlProvider',
  'Config',
    function($locationProvider, $breadcrumbProvider,$httpProvider, growlProvider, Config) {
        $locationProvider.hashPrefix('!');
        $breadcrumbProvider.setOptions({
          prefixStateName: 'app.home',
          templateUrl: Config.routes.modules + '/core/views/breadcrumb.client.view.html'
        });

        //GROWL CONFIG
        $httpProvider.interceptors.push('RequestsInterceptor');

        growlProvider.onlyUniqueMessages(true);
        growlProvider.messagesKey('mensajes');
        growlProvider.messageTextKey('mensaje');
        growlProvider.messageTitleKey('titulo');
        growlProvider.messageSeverityKey('severidad');
        growlProvider.globalDisableIcons(false);
        growlProvider.globalTimeToLive({success: 3000, error: -1, warning: -1, info: 3000});

        $httpProvider.interceptors.push(growlProvider.serverMessagesInterceptor);
    }
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') window.location.hash = '#!';

    //Then init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
})();
