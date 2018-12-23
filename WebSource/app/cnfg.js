(function() {
'use strict';

angular.module('constantConfig', [])
.constant('Config', {
    api:'http://localhost:2308/',
    redirect:'/#!/server_manager',
    apiLanPlayWeb: 'https://raw.githubusercontent.com/Urferu/Lan-Play-Server-Manager-Web/master/',
    apiLanPlayDesktop: 'https://raw.githubusercontent.com/Urferu/Lan-Play-Server-Manager/master/',
    localService:'http://localhost:2308/api/',

    routes: {
        app: 'app',
        modules: 'app/modules'
    }
 });
})();
