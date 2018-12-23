(function(){

    var server_manager = angular.module('server_manager');

    server_manager.service('svManager', svManager);

    svManager.$inject = ['req', 'Config', '$uibModal', '$ocLazyLoad'];

    function svManager(req, Config, $uibModal, $ocLazyLoad) {
        var uri = 'downloadjson';
        var handler = '';
        var thisService = this;

        this.getLocalConfig = function(pCallback)
        {
            var _uri = "state";
            req.get(_uri, {}, function (pResponse) {
                if (pCallback) {
                    pCallback(pResponse);
                }
            }, handler, Config.localService );
        };

        this.getLanguages = function(pCallback)
        {
            req.post(uri,
            {
                uri: Config.apiLanPlayDesktop + "Lenguages/LengugesDisp.json"
            }, {}, function (pResponse) {
                if (pCallback) {
                    pCallback(pResponse.data);
                }
            }, handler, Config.localService );
        };

        this.getLanguage = function(language, pCallback)
        {
            req.post(uri,
            {
                uri: Config.apiLanPlayDesktop + "Lenguages/" + language + ".json"
            }, {}, function (pResponse) {
                if (pCallback) {
                    pCallback(pResponse.data);
                }
            }, handler, Config.localService );
        };
        
        this.cargarServidoresLocales = function(pCallback) {
            var _uri = "server";
            req.get(_uri, {}, function (pResponse) {
                if (pCallback) {
                    pCallback(pResponse);
                }
            }, handler, Config.localService );
        };

        this.cargarServidoresOficiales = function(pCallback) {
            req.post(uri,
            {
                uri: Config.apiLanPlayWeb + "Servers/Servers.json"
            }, {}, function (pResponse) {
                if (pCallback) {
                    pCallback(pResponse.data);
                }
            }, handler, Config.localService );
        };

        this.cargarDatosServidor = function(params, pCallback) {
            var _uri = "info";
            
            req.post(uri,
            {
                uri: "http://" + params.ipDns + ":11451/info",
                ping: true,
                _reqName: "server_" + params.num
            }, {}, function (pResponse) {
                var respuesta = {};
                if(!pResponse.status)
                {
                    respuesta.conectados = 0;
                    respuesta.ping = 0;
                    respuesta.estatus = "Offline ";
                }
                else
                {
                    respuesta.conectados = pResponse.data.online;
                    if(parseInt(pResponse.data.ping) <= 150)
                        respuesta.ping = parseInt(pResponse.data.ping);
                    else
                        respuesta.ping = parseInt(pResponse.data.ping) - 100;
                    respuesta.estatus = "Online";
                }
                if (pCallback) {
                    pCallback(respuesta);
                }
            }, handler, Config.localService );
        };

        this.addServer = function(params, pCallback) {
            req.post('server', params, {}, function (pResponse) {
                console.log(pResponse);
                if (pCallback) {
                    pCallback(pResponse);
                }
            }, handler, Config.localService );
        };

        this.conectarLanPlay = function(params, action, pCallback) {
            req.post(action, params, {}, function (pResponse) {
                if (pCallback) {
                    pCallback(pResponse.data);
                }
            }, handler, Config.localService );
        };

        this.openNewServer = function(servers, languageManager, callback) {
            $uibModal.open({
                animation: true,
                templateUrl: Config.routes.modules + '/server_manager/views/modals/server_manager.add_server.view.html',
                controller: 'addServerController',
                controllerAs: 'vmServer',
                size: 'lg',
                resolve: {
                    servers: function(){ 
                        return servers;
                    },
                    languageManager: function(){ 
                        return languageManager;
                    },
                    callback: function(){
                        return callback;
                    },
                    lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                Config.routes.modules + '/server_manager/controllers/modals/' +
                                'server_manager.add_server.controller.js'
                            ]
                        }]);
                    }]
                }
            });
        };
    }

})();
