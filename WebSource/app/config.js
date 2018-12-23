// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
    'use strict';
    // Init module configuration options
    var applicationModuleName = 'servermanager';
    var applicationModuleVendorDependencies = [
    'ngResource',
    'ngCookies',
    'ngAnimate',
    'ngTouch',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'ui.utils',
    'LocalStorageModule',
    'naif.base64',
    'angularFileUpload' ,
    'hc.marked',
    'uiRouterStyles',
    'duScroll',
    'ncy-angular-breadcrumb',
    'angular-growl',
    'localytics.directives',
    'cfp.loadingBar',
    'constantConfig',
    'ngTable',
    'ui.grid',
    'ui.grid.pagination',
    'ui.grid.autoResize',
    'oitozero.ngSweetAlert',
    'ui.tree',
    'mgo-angular-wizard',
    'textAngular',
    'dndLists',
    'ui.calendar',
    'blockUI'];
    // Add a new vertical module
    var registerModule = function(moduleName) {
        // Create angular module
        angular.module(moduleName, []);

        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();
