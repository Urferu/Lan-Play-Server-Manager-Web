(function() {
'use strict';

angular.module('users')
.service('Authentication',[
    '$http', 
    '$state', 
    'localStorageService', 
    '$q', 
    '$rootScope',
    '$window',
    'Config',
    '$urlRouter', 
    function(
        $http, 
        $state, 
        localStorage, 
        $q, 
        $rootScope, 
        $window, 
        Config, 
        $urlRouter) 
    {
        var _this = this;

        _this.user        = localStorage.get('user');
        _this.accessToken = localStorage.get('access_token');

        function setAuthenticationData(user, tokenId) {
            _this.user = user;
            _this.accessToken = tokenId;

            localStorage.set('user', user);
            localStorage.set('access_token', tokenId);
            // if($rootScope.returnToState){
            //   $state.go($rootScope.returnToState);
            //  }else{
            //   $state.go('app.home');
            // }

            $rootScope.$broadcast('logged');
        }

        function unsetAuthenticationData() {
            _this.user = null;
            _this.accessToken = null;

            localStorage.remove('user', 'access_token');
        }

        this.login = function(credentials){
            localStorage.set('user', credentials);
        };

        this.loginAutomatico = function(token) { 
            $http({
                method: 'POST',
                url:Config.ssoDesarrollo+'/v1/verify',
                data:{token:token},
                }).then(function(response){
                    $http({
                        method: 'POST',
                        url:Config.ssoDesarrollo+'/v1/me',
                        data:{token:token},
                        }).then(function(response){
                            $urlRouter.listen();
                            setAuthenticationData(response.data.data, token);
                        },function(error){
                            $window.location.href = Config.redirect;
                    });
                },function(error){
                    $window.location.href = Config.redirect;
            });
        };

        this.logout = function() {
            unsetAuthenticationData();
            $state.go('login');
        };
        this.isAuth = function(){
            //console.log(_this);
            //if(_this.accessToken){
            if(localStorage.get('access_token')){
              return true;
            }else{
              return false;
            }
          };
        this.currentUser = function(){
            return localStorage.get('user');
        };
    }
]);
})();
