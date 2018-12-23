(function() {
'use strict';
angular.module('core')
.controller('MenuController', [
    '$scope',
    'Servmenu',
    '$state',
	'$rootScope',
	'Authentication',
	'blockUI',
	'utils',
    function($scope, Servmenu, $state, $rootScope, Authentication, blockUI, utils) {

		var usuario = Authentication.currentUser();
		$scope.collapseMenu=true;
		$scope.isLoginScreen = false;

    	$scope.toggleMenu=function(){
    		$scope.collapseMenu=!$scope.collapseMenu;
		};
		//blockUI.start();
		if(usuario){
			blockUI.stop();
			var menu = { 'menu': [] }
			menu.menu.push({
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
			$scope.tree=menu.menu;
			if($scope.tree.length > 0){
				//$scope.handleMenu();
			}
			else{
				utils.defaultAlertMessage({
					texto: 'El usuario no tiene permisos para accesar a la utilería',
					mostrarCancelar: false,
					tipoMensaje: 'warning'
				},function(){
					location.href = 'http://intranet.cln/intranet/index.php';
				});
			}
		}
		else{
			/***Descomentar para pruebas sin el test login y cambiar los datos numemp y puesto */
			// Authentication.login({numeroempleado: 93050968, numeropuesto: 77});//cambiar numemp y puesto para pruebas
			// Servmenu.getMenu({
			// 	num_empleado: usuario.numeroempleado,
			// 	num_puesto: usuario.numeropuesto
			// }).then(function(respuesta){
			// 	$scope.tree=respuesta.menu;
			// 	$scope.handleMenu();
			// });

			/**Descomentar para pruebas con el testlogin o cargar de producción */
			$scope.$on('logged', function(event, args) {
				usuario = Authentication.currentUser();
				var menu = { 'menu': [] }
				menu.menu.push({
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
				blockUI.stop();
				$scope.tree=menu.menu;
				if($scope.tree.length > 0){
					//$scope.handleMenu();
				}
				else{
					utils.defaultAlertMessage({
						texto: 'El usuario no tiene permisos para accesar a la utilería',
						mostrarCancelar: false,
						tipoMensaje: 'warning'
					},function(){
						location.href = 'http://intranet.cln/intranet/index.php';
					});
				}
			});
		}

    	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) { 
    		$scope.isCollapsed = false;
    		$scope.isLoginScreen = false;
    		if(toState.name === 'login') {
    			$scope.isLoginScreen = true;
    		}
    		if($scope.tree){
    			//$scope.handleMenu();
    		}
    	});

    	$rootScope.$on('toggleMenu', function(event, data){
         $scope.displayMenu = data;
      });

    	$scope.customFilter=function(object, searchValue){
          if(object.hasOwnProperty('state') && object.state===searchValue){

              return object;
          }
          for(var i=0;i<Object.keys(object).length;i++){
              if(typeof object[Object.keys(object)[i]]==='object'){
                  var o=$scope.customFilter(object[Object.keys(object)[i]],searchValue);
                  if(o!==null)
                      return o;
              }
          }

          return null;
        };

        $scope.handleMenu=function(){
            
            if($state.current.url==='/'){
                $scope.collapseAll();
            }else{
                var resp=$scope.customFilter($scope.tree,$state.current.name);
                var estado = $state.current.name.split('.');
                if(estado.length>2){
                    resp=$scope.customFilter($scope.tree,'app.'+estado[1]+'.'+estado[2]);
                }

                if(resp!==null){
                    $scope.expand(resp);
                }
            }
        };
    	$scope.collapseAll=function(){
          for(var key in $scope.tree){
                $scope.tree[key].show=false;
                $scope.tree[key].active=false;
    			if($scope.tree[key].padre===true){
    				for(var index in $scope.tree[key].nodes){
    					$scope.tree[key].nodes[index].show=false;
    					$scope.tree[key].nodes[index].active=false;
    				}
    			}
            }
        };
    	$scope.expand = function(data) {
    	 	if(data.padre){
    	 		if(data.nodes.length>0){
    	 			data.show=!data.show;
    	 		}else{
    	 			$scope.collapseAll();
    	 			data.active=true;
    	 		}
    	 	}else{
    	 		$scope.collapseAll();
    	 		for(var key in $scope.tree){

    	 			for(var ley in $scope.tree[key].nodes){
    	 				if($scope.tree[key].nodes[ley].name===data.name){
    	 					$scope.tree[key].active=true;
    	 					$scope.tree[key].show=true;
    	 				}
    	 			}
    	 		}
    	 		data.active=true;
    	 	}
    	};
    }
]);
})();
