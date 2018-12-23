'use strict';

angular.module('server_manager').controller('addServerController', 
    function ($scope, $uibModalInstance, $timeout, blockUI, growl, svManager, servers, languageManager, callback){
        var vmServer = this;
        vmServer.languageManager = languageManager;

        vmServer.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        };

        vmServer.ok = function(){
            if(vmServer.languageManager.StringsMessage && vmServer.languageManager.StringsMessage.PleaseWait){
                blockUI.start(vmServer.languageManager.StringsMessage.PleaseWait + '...');
            }
            else{
                blockUI.start('Please wait...');
            }
            var newServer = {
                estatus: '...',
                conectados: '...',
                ping: '...',
                num: parseInt(servers[servers.length - 1].num) + 1
            };
            if(!vmServer.ipServer){
                if(vmServer.languageManager.StringsMessage && vmServer.languageManager.StringsMessage.NeedIpServer)
                    growl.warning(vmServer.languageManager.StringsMessage.NeedIpServer, {ttl: 3000});
                else
                    growl.warning('It is necessary to capture the ip or dns of the server.', {ttl: 3000});
                return;
            }
            newServer.ipDns = vmServer.ipServer;
            if(!vmServer.abbreviationServer){
                if(vmServer.languageManager.StringsMessage && vmServer.languageManager.StringsMessage.NeedAbbreviation)
                    growl.warning(vmServer.languageManager.StringsMessage.NeedAbbreviation, {ttl: 3000});
                else
                    growl.warning('It is necessary to capture the abbreviation of the server location.', {ttl: 3000});
                return;
            }

            if(vmServer.locationName){
                newServer.ubicacion = vmServer.abbreviationServer + " - " + vmServer.locationName;
            }
            else{
                newServer.ubicacion = vmServer.abbreviationServer;
            }

            if(vmServer.validaSiExiste(newServer.ipServer)){
                if(vmServer.languageManager.StringsMessage && vmServer.languageManager.StringsMessage.ServerAlready)
                    growl.warning(vmServer.languageManager.StringsMessage.ServerAlready, {ttl: 3000});
                else
                    growl.warning('The server is already in the list.', {ttl: 3000});
                return;
            }

            svManager.addServer(newServer, function(respuesta){
                if(respuesta.status){
                    callback();
                    $uibModalInstance.dismiss('cancel');
                }
            })
        };

        vmServer.validaSiExiste=function(ip){
            var seEncuentra = false;
            for(var i = 0; i < servers.length; i++){
                if(servers[i].ipDns == ip){
                    seEncuentra = true;
                }
            }
            return seEncuentra;
        };
    }
);
