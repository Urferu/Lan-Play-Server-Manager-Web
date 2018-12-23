(function() {
'use strict';

angular.module('core').factory('Servmenu', function($http, $q, $timeout, Config) {
    // Servmenu service logic
    // ...
    //ESTA PROMESA ES UN SIMULACRO DE SERVICIO, DEBE USARSE UN HTTP HACIA LA BD CORRESPONDIENTE Y GENERA EL MENU

    //console.log(Authentication.currentUser());
    /*Authentication.login({
        idu_pais: 1,
        idu_empleado: 96545712,
        idu_empresa: 1,
        idu_centro: 1
    });*/

    var getMenu = function(pNumEmpleado){
        var url = '/empleados/'+ pNumEmpleado.num_empleado +'/opciones?idu_puesto=' + pNumEmpleado.num_puesto;
        var menu = { 'menu': [] };
        var categorias;
        return menu.menu.push({
            name: 'Comunicación',
            nodes:[{
                name: 'CBM',
                state: 'app.chat',
                icon: 'fa-comments-o',
                show: false,
                active: false,
                padre: false
            }],
            show:false,
            active:false,
            icon: 'fa-comments',
            padre:true
        });
        /*return $http.get(Config.api + url).then(function (result) {
            if ( result.status == 200) {
                var opciones = result.data.data.qryEmpleadosOpciones;

                var menu = { 'menu': [] }
                var categorias;

                // obtener las categorias
                for (var i = 0; i < opciones.length; i++) {
                    if (i == 0 || opciones[i].nom_menu_categoria != opciones[i-1].nom_menu_categoria) {
                        menu.menu.push({
                            name: opciones[i].nom_menu_categoria,
                            nodes:[],
                            show:false,
                            active:false,
                            icon: opciones[i].nom_icono,
                            padre:true
                        });
                    }
                }

                for (var i = 0; i < menu.menu.length; i++) {
                    for (var j = 0; j < opciones.length; j++) {
                        if (menu.menu[i].name == opciones[j].nom_menu_categoria) {
                            menu.menu[i].nodes.push({
                                name: opciones[j].nom_menu_opcion,
                                state: opciones[j].nom_state,
                                icon: opciones[j].nom_icono,
                                show: false,
                                active: false,
                                padre: false
                            });
                        }
                    }
                }

                // Ejemplo
                //     menu.menu.push({
                //         name: opciones[i].nom_menu_opcion,
                //         uri: opciones[i].des_url,
                //         state: opciones[i].nom_state,
                //         nodes:[],
                //         show:false,
                //         active:false,
                //         icon: opciones[i].nom_icono,
                //         padre:true
                //     });

                return menu;
            }
        }, function (error) {
            $q.reject(error)
        });*/
    };
    // Public API
    return {
        getMenu: getMenu
    };
});
})();
