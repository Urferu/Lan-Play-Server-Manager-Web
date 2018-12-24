(function() {
	'use strict';

	var server_manager = angular.module('server_manager');
	
	server_manager.controller('serverManagerController', serverManagerController);

    serverManagerController.$inject = ['$scope', '$sce', '$state', 'svManager',
        'blockUI', 'utils'];

    function serverManagerController ($scope, $sce, $state, svManager,
        blockUI, utils){
		var vmManager = this;
        var languageBrowser = navigator.language || navigator.userLanguage;
        vmManager.servers = [];
        vmManager.languages = [];
        vmManager.languageManager = {};
        vmManager.actualLanguage = {};
        vmManager.paramsLanPlay = {
            lanPlayVersion: 'v0.0.7',
            pmtu: '1500',
            selectedInterfaz: true,
            fakeInternet: true,
            showConsole: false,
            languageUser: languageBrowser.split('-')[0].toUpperCase(),
            ipDnsServer: "",
            numServer: 0
        };

        vmManager.getLocalConfig = function(){
            if(vmManager.languageManager.StringsMessage && vmManager.languageManager.StringsMessage.PleaseWait){
                blockUI.start(vmManager.languageManager.StringsMessage.PleaseWait + '...');
            }
            else{
                blockUI.start('Please wait...');
            }
            svManager.getLocalConfig(function(respuesta){
                if((respuesta && respuesta.status != 200 && respuesta.status != "Ok." && !respuesta.state) || !respuesta){
                    var datos = {
                        titulo: 'Lan Play Server Manager',
                        mostrarCancelar: true,
                        colorAceptar: '#619957',
                        tipoMensaje: 'warning'
                    };
                    datos.texto = "To load this web it is necessary to install the server manager service.\nDo you want to download the service?";
                    datos.textoAceptar = "Yes";
                    datos.textoCancelar = "No";
                    utils.defaultAlertMessage(datos, function(confirm){
                        if(confirm){
                            window.open(encodeURI('https://github.com/Urferu/Lan-Play-Server-Manager-Web/raw/master/Releases/Server Manager Installer.exe'), '_blank', '');
                        }
                        
                        $state.go('app.server_manager', {}, {reload: true});
                    });
                }
                else{
                    vmManager.paramsLanPlay = respuesta;
                    if(!vmManager.paramsLanPlay.languageUser){
                        vmManager.paramsLanPlay.languageUser = languageBrowser.split('-')[0].toUpperCase();
                    }
                    vmManager.getLanguagesList();
                }
            });
        };

        vmManager.getLanguagesList = function()
        {
            if(vmManager.languageManager.StringsMessage && vmManager.languageManager.StringsMessage.PleaseWait){
                blockUI.start(vmManager.languageManager.StringsMessage.PleaseWait + '...');
            }
            else{
                blockUI.start('Please wait...');
            }
            svManager.getLanguages(function(respuesta){
                var estaDisponible = false;
                Object.keys(respuesta).map(function(objectKey, index) {
                    vmManager.languages.push(respuesta[objectKey]);
                    if(vmManager.paramsLanPlay.languageUser.includes(objectKey)){
                        estaDisponible = true;
                    }
                });
                if(!estaDisponible){
                    vmManager.paramsLanPlay.languageUser = "EN";
                }
                vmManager.actualLanguage = {
                    abbreviation: vmManager.paramsLanPlay.languageUser
                }
                vmManager.getLanguage(vmManager.actualLanguage.abbreviation);
            });
        };

        vmManager.getLanguage = function(language){
            if(vmManager.languageManager.StringsMessage && vmManager.languageManager.StringsMessage.PleaseWait){
                blockUI.start(vmManager.languageManager.StringsMessage.PleaseWait + '...');
            }
            else{
                blockUI.start('Please wait...');
            }
            svManager.getLanguage(language, function(respuesta){
                vmManager.languageManager = respuesta;
                vmManager.cargarServidores();
            });
        };

        vmManager.cargarServidores = function(refrescar){
            if(vmManager.languageManager.StringsMessage && vmManager.languageManager.StringsMessage.PleaseWait){
                blockUI.start(vmManager.languageManager.StringsMessage.PleaseWait + '...');
            }
            else{
                blockUI.start('Please wait...');
            }
            svManager.cargarServidoresOficiales(function(respuesta){
                svManager.cargarServidoresLocales(function(respuesta2){
                    var serversTemp = respuesta.concat(respuesta2).uniqueServers();
                    if(vmManager.servers.length == 0)
                        vmManager.servers = serversTemp;
                    else if(serversTemp.length > vmManager.servers.length)
                        vmManager.servers = vmManager.servers.concat(serversTemp).uniqueServers();

                    if(!refrescar){
                        for(var i = 0; i < vmManager.servers.length; i++)
                        {
                            vmManager.actualizarDatosServer(vmManager.servers[i]);
                        }
                    }else{
                        vmManager.actualizarDatosServer(vmManager.servers[0], 1);
                    }
                });
            });
        };

        vmManager.actualizarDatosServer = function(server, nextIndex) {
            svManager.cargarDatosServidor(server, function(respuesta){
                server.estatus = respuesta.estatus;
                server.conectados = respuesta.conectados;
                server.ping = respuesta.ping;
                if(nextIndex && nextIndex < vmManager.servers.length){
                    vmManager.actualizarDatosServer(vmManager.servers[nextIndex], nextIndex + 1);
                }
            });
        };

        vmManager.claseRenglon = function(server)
        {
            if(server.estatus.includes('Offline'))
            {
                return "bg_offline";
            }
            if(server.num%2 == 0)
            {
                return "";
            }
            else
            {
                return "bg-info";
            }
        };

        vmManager.getFlag = function(server)
        {
            return "flag-icon flag-icon-" + server.ubicacion.substr(0,2).toLowerCase();
        }

        Array.prototype.uniqueServers = function() {
            var a = this.concat();
            for(var i=0; i<a.length; ++i) {
                for(var j=i+1; j<a.length; ++j) {
                    if(a[i].ipDns === a[j].ipDns)
                        a.splice(j--, 1);
                }
            }

            return a;
        };

        vmManager.changeLanguage = function(){
            vmManager.paramsLanPlay.languageUser = vmManager.actualLanguage.abbreviation;
            vmManager.getLanguage(vmManager.actualLanguage.abbreviation);
        };

        vmManager.conectarDesconectarServer = function(Servidor, conectar){
            var obj = {};
            if(conectar=='connect')
            {
                if(vmManager.languageManager.StringsMessage && vmManager.languageManager.StringsMessage.Connecting){
                    blockUI.start(vmManager.languageManager.StringsMessage.Connecting + '...');
                }
                else{
                    blockUI.start('Connecting...');
                }
            }
            else
            {
                if(vmManager.languageManager.StringsMessage && vmManager.languageManager.StringsMessage.Disconnecting){
                    blockUI.start(vmManager.languageManager.StringsMessage.Disconnecting + '...');
                }
                else{
                    blockUI.start('Disconnecting...');
                }
            }
            
            angular.copy(vmManager.paramsLanPlay, obj);
            obj.ipDnsServer = Servidor.ipDns;
            obj.numServer = Servidor.num;
            if(conectar=='connect' && vmManager.paramsLanPlay.numServer != 0){
                var datos = {
                    titulo: 'Lan Play Server Manager',
                    mostrarCancelar: true,
                    colorAceptar: '#619957',
                    tipoMensaje: 'warning',
                    texto: 'A server is already connected.\nDo you want to disconnect it to connect to the new server?',
                    textoAceptar: 'Yes',
                    textoCancelar: 'No'
                };
                if(vmManager.languageManager.StringsMessage && vmManager.languageManager.StringsMessage.ServerConnected){
                    datos.texto = vmManager.languageManager.StringsMessage.ServerConnected;
                }
                if(vmManager.languageManager.StringsMessage && vmManager.languageManager.StringsMessage.ButtonYes){
                    datos.textoAceptar = vmManager.languageManager.StringsMessage.ButtonYes;
                }
                if(vmManager.languageManager.StringsMessage && vmManager.languageManager.StringsMessage.ButtonNo){
                    datos.textoCancelar = vmManager.languageManager.StringsMessage.ButtonNo;
                }
                utils.defaultAlertMessage(datos, function(confirm){
                    if(confirm){
                        svManager.conectarLanPlay(obj, 'disconnect', function(respuesta){
                            svManager.conectarLanPlay(obj, conectar, function(respuesta){
                                vmManager.paramsLanPlay = respuesta;
                            });
                        });
                    }
                });
            }
            else{
                svManager.conectarLanPlay(obj, conectar, function(respuesta){
                    vmManager.paramsLanPlay = respuesta;
                });
            }
        };

        vmManager.changeAutoSelectedInterfaz = function(){
            if(!vmManager.paramsLanPlay.selectedInterfaz){
                vmManager.paramsLanPlay.showConsole = true;
            }
        };

        vmManager.changeShowConsole = function(){
            if(!vmManager.paramsLanPlay.ShowConsole){
                vmManager.paramsLanPlay.selectedInterfaz = true;
            }
        };

        vmManager.agregarServidor = function(){
            svManager.openNewServer(vmManager.servers, vmManager.languageManager, function(){
                vmManager.cargarServidores(true);
            });
        };

        vmManager.getLocalConfig();
    }
})();