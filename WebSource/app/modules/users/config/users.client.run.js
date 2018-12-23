(function() {
'use strict';

angular.module('users').run([
    '$rootScope', 
    'Authentication', 
    '$location',
    'growlMessages',
    '$state',
    '$window',
    '$urlRouter',
    'Config',
    function(
        $rootScope, 
        Authentication, 
        $location,
        growlMessages, 
        $state, 
        $window, 
        $urlRouter, 
        Config) {
        // //DESCOMENTAR SI SE VA USAR LOGIN
        $urlRouter.sync();
        var token = $location.search().token;
        if(token){
         Authentication.loginAutomatico(token);
         return false;
        }else{
         if(!Authentication.isAuth()){
             $window.location.href = Config.redirect;
             return false;
         }
            
        }
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
            if(!Authentication.isAuth() && toState.name !== 'login'){
                $rootScope.returnToState = toState.name;
                $rootScope.returnToStateParams = toParams;
                Authentication.logout();
                event.preventDefault();
            }
            if(toState.name==='login' && Authentication.isAuth() === true){
                   $state.go('app.home');
                   event.preventDefault();
            }
        });
        
        $rootScope.$on('$stateChangeSuccess', function(event,toState){
          growlMessages.destroyAllMessages();
          event.preventDefault();
        });
    }
]);
})();
