'use strict';
(function($, angular){
	var gGrid = angular.module('GGrid', []);

	gGrid.factory('$GGrid', ['$http', 'Config', 'growl', function($http, Config, growl){
		//Propiedades de la clase.
		var thisx = {};

		//Constructor.
		function GGrid( pId, pValue )
		{
			//Generamos la instancia correspondiente.
			this.id = "ins" + new Date().getTime();
			thisx[ this.id ] = {};

			//this.realod = reload;

			//Inicializamos variables.
			thisx[ this.id ].id = pId;
			thisx[ this.id ].idReal = new Date().getTime();
			thisx[ this.id ].idContent = 'dt' + new Date().getTime();
			thisx[ this.id ].$GGrid = $( pId ).attr({
				class: 'table table-striped table-bordered',
				cellspacing: 0,
				width: '100%'
			});
			thisx[ this.id ].$GGridReal = null;
			thisx[ this.id ].$GGridContent = null;
			thisx[ this.id ].actions = pValue && pValue.actions ? pValue.actions : [];

			if (pValue.params) {
				thisx[ this.id ].params = pValue.params;
			}

			//Definimos los atributos del GGrid.
			setValue( pValue ? pValue : null, thisx[ this.id ] );
		}

		//Función para crear el GGrid.
		function create( pInstance )
		{

			var instance = pInstance ? pInstance : thisx[ this.id ];

			//Validamos si existe el GGrid.
			if( instance.$GGrid.length == 0 )
				return alert( 'El grid "' + instance.id + '" no existe.' );

			//Si existe lo eliminamos.
			//del( instance );

			//Metemos el datatable dentro de un div.
			var dtd = $( '<div id="' + instance.idContent + '">' );
			instance.$GGrid.after( dtd );
			instance.$GGridContent = $( '#' + instance.idContent );

			instance.$GGrid.appendTo( instance.$GGridContent );
			instance.$GGridReal = instance.$GGrid;

			instance.slt = '';

			instance.$GGrid.find('th[field]').each(function(index){
				if( instance.slt != '' )
				instance.slt += ', ';

				instance.slt += $(this).attr('field');
			});

			//Obtenemos los parámetros.
			var params = buildParams( instance );

			params._slt = instance.slt;
			params._rows = instance.rows;
			params._page = instance.page;

			//Hacemos la petición por ajax para obtener los registros del GGrid.
			loadGrid( instance, params, function(json){
				var dataSet = dataFormat( instance, json );
				instance.records = dataSet.records;
				instance.recordsPage = dataSet.data.length;

				//Creamos el grid.
				instance.$oDataTable = instance.$GGridReal.DataTable({
					responsive: true,
					data: dataSet.data,
					columns: dataSet.columns,
					ordering: false,
					pageLength: 50,
					lengthMenu: [ [10, 20, 35, 50, 100], [10, 20, 35, 50, 100] ],
					searching: false,
					info: true,
					paging: true,
					pagingType: 'full_numbers',
					language: {
						'sProcessing': 'Procesando...',
						'sLengthMenu': 'Mostrar _MENU_ registros',
						//'sLengthMenu': '',
						'sZeroRecords': 'No se encontraron resultados',
						'sEmptyTable': 'Ningún dato disponible en esta tabla',
						//'sInfo': 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
						'sInfo': '',
						'sInfoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
						'sInfoFiltered': '(filtrado de un total de _MAX_ registros)',
						'sInfoPostFix': '',
						'sSearch': 'Buscar: ',
						'sUrl': '',
						'sInfoThousands':  ',',
						'sLoadingRecords': 'Cargando...',
						'oPaginate': {
							'sFirst': 'Primero',
							'sLast': 'Último',
							'sNext': 'Siguiente',
							'sPrevious': 'Anterior'
						},
						'oAria': {
							'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
							'sSortDescending': ': Activar para ordenar la columna de manera descendente'
						}
					},
					fnDrawCallback: function(){
						var api = this.api();
						var rows = api.rows({page:'current'}).nodes();
						
						if( instance.groupBy )
						{
				            var last = null;
				            var idxColumnGroupBy = null;

				 			//Search for column groupBy.
				 			for(var x=0; x<instance.columns.length; x++)
				 			{
				 				if( instance.groupBy === instance.columns[x].field )
				 				{
				 					idxColumnGroupBy = x;
				 					break;
				 				}
				 			}

				 			if( idxColumnGroupBy )
				 			{
					            api.column( idxColumnGroupBy, {page:'current'} ).data().each( function ( group, i ){
					                if ( last !== group )
					                {
					                    $(rows).eq( i ).before(
					                        '<tr class="group"><td colspan="' + instance.$GGrid.find('th').length + '">' + group + '</td></tr>'
					                    );

					                    last = group;
					                }
					            });
				        	}
						}
									
						//Validamos la función "rows".
						if( instance.onRowCallback )
						{
							setTimeout(function(){
								$.each(rows, function( pIndex, pElem ){
									instance.onRowCallback( instance.$oDataTable.row( $(rows).eq(pIndex) ).data(), $(pElem) );
								});
							}, 100);
						}

						//Registramos el "onDblClick".
						if( instance.onDblClick )
						{
							instance.$GGridContent.find('tbody').on('dblclick', 'tr', function(){
								var row = instance.$oDataTable.row( this ).data();

								instance.onDblClick( row );
							});
						}

						//Validamos para el "onLoadComplete".
						if( instance.onLoadComplete )
						{
							setTimeout(function(){
								instance.onLoadComplete();
							}, 100);
						}

						//Evento al seleccionar un row.
						instance.$GGridContent.find('tbody').on('click', 'tr', function(){
							if( !$(this).hasClass('group') )
							{
								if( $(this).hasClass('selected') )
									$(this).removeClass('selected');
								else
								{
									instance.$oDataTable.$('tr.selected').removeClass('selected');
									$(this).addClass('selected');
								}

								//Evento para el "onClick".
								if( instance.onClick )
									instance.onClick( $(this).hasClass('selected') );
							}
						});
					}
				});

				//Movemos de lugar el select al siguiente div.
				var $divLengthSelect = instance.$GGridContent.find('.dataTables_length').parent();
				instance.$GGridContent.find('.dataTables_length').appendTo( $divLengthSelect.next() );

				//Movemos el select a otro label para quitar el texto.
				instance.$GGridContent.find('.dataTables_length').addClass('pull-right').append('<label class="gg-ls">');
				instance.$GGridContent.find('.dataTables_length select').val(10)
					.appendTo( instance.$GGridContent.find('.dataTables_length label.gg-ls') );
				instance.$GGridContent.find('.dataTables_length label:first').remove();
				instance.$GGridContent.find('.dataTables_length select').addClass("browser-default");

				//Creamos las acciones.
				$divLengthSelect.append('<ul class="pagination dt-actions">');
				var $ulActions = $divLengthSelect.find('ul.pagination');
				var actions;
				var icon;
				var title;

				for( var x=0; x<instance.actions.length; x++ )
				{
					actions = '';
					icon = '';
					title = '';

					//Creamos un id para esta acción.
					instance.actions[x].id = 'dt_' + instance.actions[x].type
					+ '_' + Math.floor( ( Math.random() * 100000 ) + 1 );
					icon = '';

					if( $.trim( instance.actions[x].type ) )
					{
						switch( $.trim( instance.actions[x].type ) )
						{
							case 'add':
								icon += 'fa fa-plus-circle dt-add';
								title = 'Nuevo';
								break;
							case 'edit':
								icon += 'fa fa-pencil-square dt-edit';
								title = 'Editar';
								break;
							case 'delete':
								icon += 'fa fa-window-close dt-delete';
								title = 'Borrar';
								break;
							case 'search':
								icon += 'fa fa-search';
								title = 'Buscar';
								break;
							case 'custom':
								icon += instance.actions[x].icon;
								title = instance.actions[x].title;
								break;
							default:
								icon += '';
								title = '';
								break;
						}
					}

					actions =
						'<li class="paginate_button dt-position-' + x + '" title="' + title + '">' +
							'<a>' +
								'<i class="' + icon + '" aria-hidden="true" id="'
									+ instance.actions[x].id + '">' +
								'</i>' +
								title +
							'</a>' +
						'</li>';

					$ulActions.append( actions );

					//Evento para esta acción.
					(function( pAction ){
						instance.$GGridContent.find( '.dt-actions .dt-position-' + x ).on('click', function(){
							var $trSelected = instance.$GGridContent.find('tbody tr.selected');
							var row = null;

							if( $trSelected.length )
								row = instance.$oDataTable.row( $trSelected[0] ).data();

							if( pAction.event )
								pAction.event( row );
						});
					})( instance.actions[x] );
				}

				//Registramos los eventos del datatable.
				registerEvents( instance );

				//Evento para las páginas.
				instance.$GGridReal.find('th[field]').off().on('click', function(){
					var field =  $(this).attr('field');
					var sortname = field;
					var orderBy = $(this).attr('orderBy');
					orderBy = orderBy ? orderBy : 'DESC';

					//Validamos el ORDER BY.
					if( orderBy === 'ASC' )
						orderBy = 'DESC';
					else if( orderBy === 'DESC' )
						orderBy = 'ASC';

					sortname += ' ' + orderBy;

					$(this).attr({
						orderBy: orderBy
					});

					instance.orderBy = sortname;

					//Quitamos la clase a todos los th, excepto al actual.
					instance.$GGridReal.find( "th[field!='" + field + "']" ).removeAttr('orderBy');

					//Recargamos.
					reload( null, false, instance );
				});
			});
		}

		//Función para la página anterior.
		function prevPage( pInstance )
		{
			//Validamos que el paginado no haya llegado al tope.
			if( ( pInstance.page - 1 ) > 0 )
			{
				pInstance.page--;

				//Recargamos el GGrid.
				reload( null, true, pInstance );
			}
		}

		//Funciíon para la siguiente página.
		function nextPage( pInstance )
		{
			//Validamos que el paginado no haya llegado al tope.
			if( pInstance.page < pInstance.pages )
			{
				pInstance.page++;

				//Recargamos el GGrid.
				reload( null, true, pInstance );
			}
		}

		//Función para ir a la primer página.
		function firstPage( pInstance )
		{
			//Validamos que el paginado no esté en la primer página.
			if( pInstance.page != 1 )
			{
				pInstance.page = 1;

				//Recargamos el GGrid.
				reload( null, true, pInstance );
			}
		}

		//Función para ir a la última página.
		function lastPage( pInstance )
		{
			//Validamos que el paginado no esté en la útlima página.
			if( pInstance.page != pInstance.pages )
			{
				pInstance.page = pInstance.pages;

				//Recargamos el GGrid.
				reload( null, true, pInstance );
			}
		}

		//Función para recargar el GGrid.
		function reload( pParams, pMantenerPaginado, pInstance )
		{
			var instance = pInstance ? pInstance : thisx[ this.id ];

			var opcMantenerPaginado = pMantenerPaginado === undefined || pMantenerPaginado === 'undefined' ? false : pMantenerPaginado;

			//Validamos si ya está definido el "slt".
			if( !instance.slt )
			{
				instance.$GGrid.find('th[field]').each(function(){
					if( instance.slt != '' )
						instance.slt += ', ';

					instance.slt += $.trim( $(this).attr('field') );
				});
			}

			if( pParams )
				instance.params = pParams;

			//Si aún no existe el grid, entonces se manda a crear.
			if( instance.GGridContent )
				create( instance );
			else
			{
				var parametros = buildParams( instance );

				parametros._slt = instance.slt;

				//Validamos si vienen parámetros extras para agregarlos.
				if( pParams )
				{
					for( var key in pParams )
					{
						parametros[ key ] = pParams[ key ];
					}
				}

				//Obtenemos el paginado actual.
				if( opcMantenerPaginado === false )
					instance.page = 1;

				parametros._rows = instance.rows;
				parametros._page = instance.page;

				loadGrid(instance, parametros, function( json ){
					var dataSet = dataFormat( instance, json );
					instance.records = dataSet.records;
					instance.recordsPage = dataSet.data.length;

					instance.$GGridReal.DataTable({
						retrieve: true,
						data: dataSet.data,
						columns: dataSet.columns
					});

					instance.$GGridReal.dataTable().fnClearTable();
					if( dataSet.data.length )
						instance.$GGridReal.dataTable().fnAddData( dataSet.data );

					registerEvents( instance );
				});
			}
		}

		//Función para consultar los registros del GGrid.
		function loadGrid( pInstance, pParams, pCallback )
		{
			$.ajax({
				url: Config.api + pInstance.url,
				data: pParams,
				dataType: 'json',
				success: function(pData){
					if( pData )
						pCallback( pData.data );
					else
						console.error( 'Something is wrong whit yout grid' );
				}
			});
		}

		//Función para construir los parámetros.
		function buildParams( pInstance )
		{
			//Armamos los parámetros.
			var params = pInstance.params;

			params._paginate = 1;

			if( pInstance.orderBy )
				params._orderBy = pInstance.orderBy;

			return params;
		}

		//Función para formatear el json que recibe el GGrid.
		function dataFormat( pInstance, pData )
		{ 
			//Armamos el array para el grid.
			var keys = null;
			var data = null;
			var columns = new Array();
			var dataF = new Array();

			for( var key in pData )
			{
				if( key !== '_info' )
				{
					keys = key;
					data = pData[ keys ];

					break;
				}
			}

			pInstance.pages = data.pages * 1;

			//if( data.data.length )
			//{
			var idx = 1;
			var thsTotal = pInstance.$GGridReal.find('th').length - 1;
			
			for( var x=0; x<pInstance.columns.length; x++ )
			{
				(function(pIndex, pColumns){
					if( pInstance.columns[pIndex].render )
					{
						columns.push({
							visible: pInstance.columns[pIndex].visible === undefined ? true : pInstance.columns[pIndex].visible,
							className: '',
							mRender: function(pData, pType, pRow){ 
								var elementHTML = pInstance.columns[pIndex].render( pRow );
								
								if( elementHTML )
									return elementHTML;
								else
								{
									return '<label style="color: red;">You must return an element in your "render" function.</label>';
								}
							}
						});
					}
					else
					{
						columns.push({
							visible: pInstance.columns[pIndex].visible === undefined ? true : pInstance.columns[pIndex].visible,
							className: pInstance.columns[pIndex].align ? pInstance.columns[pIndex].align : 'left',
							data: pInstance.columns[pIndex].field
						});
					}
				})(x);
			}

			return {
				data: data.data,
				columns: columns,
				page: data.page,
				pages: data.pages,
				records: data.records,
				key: keys
			};
		}

		//Función para registrar los eventos del datatable.
		function registerEvents( pInstance )
		{
			var instance = pInstance;
			var start = ( instance.rows * instance.page - instance.rows ) + 1;

			//Registramos los eventos para el paginado.
			instance.$GGridContent.find( '.paginate_button.previous' ).off().on("click", function(){
				prevPage( instance );
			});

			instance.$GGridContent.find( '.paginate_button.next' ).off().on("click", function(){
				nextPage( instance );
			});

			//Modificamos la "info".
			instance.$GGridContent.find('div.dataTables_info').html(
				'Página ' + instance.page + ' | ' + instance.records + ' registros en total'
			);

			//Comprobamos los sort.
			instance.$GGridReal.find('th').each(function(){
				var classs = 'sorting';
				var orderBy = $(this).attr('orderBy');

				if( orderBy )
				{
					if( orderBy === 'ASC' )
						classs = 'sorting_asc';
					else if( orderBy === 'DESC' )
						classs = 'sorting_desc';
				}

				$(this).attr({
					class: classs
				});
			});

			//Paginado.
			var paginas = '';
			var pagesPage = 9;
			var start = instance.page;
			var end = instance.page + pagesPage;
			var dif = end - instance.pages;

			//Topamos a que no sea mayor que el paginado.
			if( end > instance.pages )
			{
				start -= dif;
				end -= dif;

				//Corroboramos que "start" no sea menor a 1.
				if( start <= 0 )
					start = 1;
			}

			for( var x=start; x<=end; x++ )
			{
				paginas +=
					'<li class="paginate_button dt-pager ' + ( x === instance.page ? 'active' : '' ) + '">' +
						'<a aria-controls="' + instance.$GGridReal.attr('id') + '" data-dt-idx="' + x +
							'" tabindex="0">' + x +
						'</a>' +
					'</li>';

				if( x === end && end < instance.pages )
					paginas +=
						'<li class="paginate_button dt-pager ' + ( x === instance.page ? 'active' : '' ) + '">' +
							'<a aria-controls="' + instance.$GGridReal.attr('id') + '" data-dt-idx="' + x +
								'" tabindex="0">' + '...' +
							'</a>' +
						'</li>';
			}

			instance.$GGridContent.find('.dataTables_paginate li:eq(2)').remove();
			instance.$GGridContent.find('.dataTables_paginate .paginate_button.previous').after( paginas );

			//Eventos para el paginado.
			instance.$GGridContent.find('.dataTables_paginate li.dt-pager').off().on('click', function(){
				instance.page = $(this).find('a').attr('data-dt-idx') * 1;

				//Recargamos el GGrid.
				reload( null, true, instance );
			});

			instance.$GGridContent.find('.dataTables_paginate .paginate_button.first').off().on('click', function(){
				firstPage( instance );
			});

			instance.$GGridContent.find('.dataTables_paginate .paginate_button.last').off().on('click', function(){
				lastPage( instance );
			});

			instance.$GGridContent.find('.dataTables_length select').off().on('change', function(){
				instance.rows = this.value;

				reload( null, false, instance );
			});

			//Validamos los botones a habilitar o deshabilitar.
			if( instance.pages > instance.page )
			{
				instance.$GGridContent
					.find('.dataTables_paginate')
					.find('.paginate_button.next, .paginate_button.last')
					.removeClass('disabled');
			}

			if( instance.page > 1  )
			{
				instance.$GGridContent
					.find('.dataTables_paginate')
					.find('.paginate_button.first, .paginate_button.previous')
					.removeClass('disabled');
			}

			//Quitamos el atributo href a los botones de paginado.
			instance.$GGridContent.find('.dataTables_paginate .pagination a').removeAttr('href');
		}

		//Función para borrar el GGrid.
		function del( pInstance )
		{
			$( "#div_grid_" + pInstance.idReal + ", #div_gd_actions_" + pInstance.idReal ).remove();
		}

		//Función para establecer los atributos del GGrid.
		function setValue( pValue, pInstance )
		{
			var instance = pInstance ? pInstance : thisx[ this.id ];
			//Atributos por default.
			instance.actions = new Array();
			instance.onClick = null;
			instance.onDblClick = null;
			instance.onLoadComplete = null;
			instance.onRowCallback = null;
			instance.multiselect = false;
			instance.autofilter = true;
			instance.page = 1;
			instance.rows = 10;

			if( pValue )
			{
				for( var key in pValue )
				{
					instance[ key ] = pValue[ key ];
				}
			}

			if( instance.params )
				instance.params = instance.params;
			else
			{
				var arrayParams = ( instance.$GGrid.attr('params') ? $.trim( instance.$GGrid.attr('params') ) : "" ).split('&');
				var arrayParam = null;
				instance.params = {};

				for( var x=0; x<arrayParams.length; x++ )
				{
					arrayParam = arrayParams[x].split('=');
					instance.params[ $.trim( arrayParam[0] ) ] = $.trim( arrayParam[1] );
				}
			}

			// //Establecemos el source, el params y el orderBy.
			instance.url = ( instance.url ? instance.url : instance.$GGrid.attr('url') );
			instance.orderBy = instance.orderBy ? instance.orderBy : '';
		}

		function getRow( pFnc )
		{
			var instance = thisx[ this.id ];

			var $trSelected = instance.$GGridContent.find('tbody tr.selected');
			var row = null;

			if( $trSelected.length )
				row = instance.$oDataTable.row( $trSelected[0] ).data();
			else
				return growl.warning('Debe seleccionar un registro.', {ttl: 2000, disableCountDown: true});

			if( pFnc )
				pFnc( row );
		}

		//FUNCIONES PÚBLICAS.
		GGrid.prototype =  Object.create(Object.prototype, {
			create: { writable: false, enumerable: false, configurable: false, value: create },
			reload: { writable: false, enumerable: false, configurable: false, value: reload },
			setValue: { writable: false, enumerable: false, configurable: false, value: setValue },
			getRow: { writable: false, enumerable: false, configurable: false, value: getRow }
		});

		return GGrid;
	}]);

	gGrid.directive('ggrid', [ '$GGrid', '$timeout', function ($GGrid, $timeout) {
	    return {
	        restrict : 'E',
	        scope: {
	            model: '=',
				options: '=',
				ondblclickrow: '=',
				onloadcomplete: '=',
				onclickrow: '=',
				onrowcallback: '='
	        },
			template:
				'<table id="{{options.idu}}">' +
				  '<thead> ' +
				    '<tr> ' +
				      '<th field="{{ header.field }}" visible="{{ header.visible }}" ng-repeat="header in options.headers track by $index"> ' +
				        '{{ header.title }} ' +
				      '</th>' +
				    '</tr>' +
				  '</thead>'+
				'</table>',
		    link: function(scope, element, attr) {
				var idGrid = '#' + scope.options.idu;
				var options = scope.options;

				$timeout(function(){
					var values = {};
					values.columns = options.headers;
					values.url = options.url;
					values.groupBy = options.groupBy;
					values.actions = options.actions;

					if (scope.ondblclickrow) {
						values.onDblClick = scope.ondblclickrow;
					}

					if (scope.onloadcomplete) {
						values.onLoadComplete = scope.onloadcomplete;
					}
					if (scope.onclickrow) {
						values.onClick = scope.onclickrow;
					}

					if( scope.onrowcallback )
					{
						values.onRowCallback = scope.onrowcallback	;
					}

					if (options.params) {
						values.params = options.params;
					}

					scope.model = new $GGrid(idGrid, values);

					if (options.create) {
						if (options.url) {
							scope.model.create();
						} else {
							alert('Para crear el gird, es necesario el atributo url');
						}
					}
				});
		    }
	    }
	}]);


})($, angular);
