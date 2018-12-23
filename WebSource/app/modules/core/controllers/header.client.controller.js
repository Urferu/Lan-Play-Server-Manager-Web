(function() {
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Menus','$rootScope', 'Authentication', '$timeout', 'Config',
        'blockUI',
    function($scope, Menus, $rootScope, Authentication, $timeout, Config,
        blockUI) {
        var vmHeader = this;
        vmHeader.btnToggler = false;
        $scope.isCollapsed = false;
        $scope.menu = Menus.getMenu('topbar');
        $scope.isLoginScreen = false;

        vmHeader.hojaAzul = Config.hojaAzul;
        vmHeader.usuario = Authentication.currentUser();
        if(!vmHeader.usuario){
            /***Descomentar para pruebas sin el test login y cambiar los datos numemp y puesto */
            // Authentication.login({numeroempleado: 93050968, numeropuesto: 77});
            // vmHeader.usuario = Authentication.currentUser();

            
            /**Descomentar para pruebas con el testlogin o cargar de producción */
            $scope.$on('logged', function(event, args) {
                //Authentication.login(Authentication.currentUser());
                vmHeader.usuario = Authentication.currentUser();
                blockUI.stop();
            });
        }

        vmHeader.toggleCollapsibleMenu = function() {
            vmHeader.isCollapsed = !vmHeader.isCollapsed;
        };

        $scope.$on('$stateChangeSuccess', function(
            _event,
            _toState,
            _toParams,
            _fromState,
            _fromParams
        ) {
            vmHeader.isCollapsed = false;
            vmHeader.isLoginScreen = false;
            if (_toState.name === 'login') {
                vmHeader.isLoginScreen = true;
            }
        });
        vmHeader.toggleMenu = function() {
            vmHeader.btnToggler = !vmHeader.btnToggler;
            $rootScope.$broadcast('toggleMenu', vmHeader.btnToggler);
        };

        vmHeader.logout = function() {
            Authentication.logout();
        };
        
    }
]);
})();