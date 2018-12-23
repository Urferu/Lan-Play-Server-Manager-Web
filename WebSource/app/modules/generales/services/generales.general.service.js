(function(){

    var generales = angular.module('generales');

    generales.factory('svGeneral', svGeneral);

    svGeneral.$inject = ['req', 'Config', 'utils', '$uibModal'];

    function svGeneral(req, Config, utils, $uibModal) {
        var uri = '/generales';
        var handler = 'generales';

        return {
            obtenerFechaActual: function(params, pCallback) {
                var _uri = uri + "/obtenerFechaActual";
                if (!pCallback) {
                    pCallback = params;
                } else if(params) {
                    _uri = _uri + '?' + $.param(params);
                }

                req.get(_uri, {}, function (pResponse) {
                    if (pCallback) {
                        pCallback(pResponse.data);
                    }
                }, handler );
            },
            obtenerFechaHoraActual: function(params, pCallback) {
                var _uri = uri + "/obtenerFechaHoraActual";
                if (!pCallback) {
                    pCallback = params;
                } else if(params) {
                    _uri = _uri + '?' + $.param(params);
                }

                req.get(_uri, {}, function (pResponse) {
                    if (pCallback) {
                        pCallback(pResponse.data);
                    }
                }, handler );
            },
            obtenerFechaCambioDias: function(params, pCallback) {
                var _uri = uri + "/obtenerFecha/" + params;
                if (!pCallback) {
                    pCallback = params;
                } else if(params) {
                    //_uri = _uri + '?' + params;
                }

                req.get(_uri, {}, function (pResponse) {
                    if (pCallback) {
                        pCallback(pResponse.data);
                    }
                }, handler );
            }
        }
    }

})();
