(function($){
	//Propiedades de la clase.
	var thisx = {};

	//Constructor.
	function GGrid( pId, pValue )
	{
		//Generamos la instancia correspondiente.
		this.id = "ins" + new Date().getTime();
		thisx[ this.id ] = {};

		//Inicializamos variables.
		thisx[ this.id ].idReal = new Date().getTime();
		thisx[ this.id ].$GGrid = $( pId );
		thisx[ this.id ].$GGridReal = null;

		//Definimos los atributos del GGrid.
		setValue( pValue ? pValue : null, thisx[ this.id ] );
	}

	//Función para crear el GGrid.
	function create( pInstance )
	{
		var instance = pInstance ? pInstance : thisx[ this.id ];

		//Validamos si existe el GGrid.
		if( instance.$GGrid.size() == 0 )
			return _gmessage.warning( "El grid <b>" + instance.$GGrid.attr("id") + "</b> no existe." );

		//Si existe lo eliminamos.
		del( instance );

		//Creamos el table.
		var table = $('<div align="center">')
			.attr( 'id', 'div_grid_' + instance.idReal )
			.html(
					'<table id="grid_' + instance.idReal + '">' +
					'</table>' +
					'<div id="pager_' + instance.idReal + '"></div>'
			);
		instance.$GGrid.after( table );
		instance.$GGridReal = $( "#grid_" + instance.idReal );

		var colNames = '';
		var colModel = '';
		var visible;
		var widthColumn;
		var sortable;
		var align;
		var formatter;
		var slt = "";

		instance.$GGrid.find("column").each(function(index){
			visible = ( ( $(this).attr("visible") ) ? $(this).attr("visible") : "true" ).toUpperCase();
			widthColumn = ( ( $(this).attr("width") ) ? ", width: " + $(this).attr("width") : "" );
			sortable = ", sortable: false";
			align = ( ( $(this).attr("align") ) ? ", align: '" + $(this).attr("align") + "'" : "" );
			formatter = ( ( $(this).attr("data_type") ) ? ", formatter: '" + $(this).attr("data_type") + "'" : "" );

			if( visible == "FALSE" )
				visible = "hidden: true";
			else
				visible = "hidden: false";

			if( colNames != '' )
			{
				colModel += ', ';
				colNames += ', ';
				slt += ", ";
			}

			slt += $(this).attr("field");
			colNames += '"' + $(this).text() + '"';
			colModel += '{label: "' + $.trim( $(this).attr("title") )
				+ '", name:"' + $.trim( $(this).attr("field") )
				+ '", key: ' + ( $(this).attr("key") == "true" ? true : false ) + ', '
				+ 'sorttype: function( cellValue, obj ){ return 0; },'
				+ visible + widthColumn + sortable + align + formatter + '}';
		});

		colNames = "[" + colNames + "]";
		colModel = "[" + colModel + "]";

		//Collapse.
		var groupingViewArray = new Array();
		var groupColumnShowArray = new Array();
		var groupOrderArray = new Array();
		var groupingView = instance.groupingView.split(",");

		for( x = 0; x<groupingView.length; x++ )
		{
			groupingViewArray.push( $.trim( groupingView[x] ) );
			groupColumnShowArray.push( false );
			groupOrderArray.push( "asc" );
		}

		//Obtenemos los parámetros.
		var params = buildParams( instance );

		params.slt = slt;
		params.rows = instance.rows;
		params.page = instance.page;

		//Hacemos la petición por ajax para obtener los registros del GGrid.
		loadGrid( instance, params, function(json){
			var data = dataFormat( instance, json.data );

			//Creamos el grid.
			instance.$GGridReal.jqGrid({
				data: data.dataFormated,
				height: "auto",
				datatype: "local",
				colModel: eval( colModel ),
				rowNum: 10,
				autowidth: true,
				forceFit: true,
				gridview: true,
				multiselect: instance.multiselect,
				grouping: instance.grouping,
				groupingView: { groupField : groupingViewArray,
							    groupColumnShow: groupColumnShowArray,
								groupCollapse: instance.groupCollapse === true ? true : false,
								groupOrder: groupOrderArray,
								groupText : [ "<b>" + instance.groupText + "{0}</b>" ]
				},
				//caption: p_titulo,
				onSelectRow: function(){
					if( instance.onSelect ) instance.onSelect();
				},
				loadComplete: function(){
					if( instance.onLoadComplete ) instance.onLoadComplete();
				},
				ondblClickRow: function(){
					if( instance.onDblClick ) instance.onDblClick();
				}
			});

			//Acciones.
			var actions = '';
			instance.$GGrid.find("action").each(function(){
				var action = ( ( ( $.trim( $(this).attr("type") ) ) ? $(this).attr("type") : "" ) == "" ? false : $(this).attr("type") );
				var actId = ( ( $(this).attr("id") ) ? $(this).attr("id") : "" );
				var title = $.trim( $(this).attr("title") );
				var icon = ( ( $(this).attr("icon-class") ) ? $(this).attr("icon-class") : "" );
				var style = "";

				if( action )
				{
					action = action.toUpperCase();

					if( action == "ADD" )
					{
						icon = "fa-plus";
						title = title ? title : "Nuevo";
						style = "color: #007100;";
					}
					else if( action == "EDIT" )
					{
						icon = "fa-pencil-square-o";
						title = title ? title : "Editar";
						style = "color: rgb(172, 86, 0);";
					}
					else if( action == "DELETE" )
					{
						icon = "fa-trash-o";
						title = title ? title : "Borrar";
						style = "color: red;";

					}
					else if( action == "CUSTOM" )
					{
						style = "color: #000;";
					}

					actions +=
						'<li act_id="' + actId + '" title="' + title + '">' +
							'<i class=" fa ' + icon + '" style="' + style + '"></i>' +
							'<span>' + title + '</span></li>';
				}
			});

			$( "#div_grid_" + instance.idReal ).append(
				'<div class="ggrid-pager">' +
					'<ul>' +
						'<li class="ggrid-actions">' +
							'<ul>' +
								'<button style="visibility: hidden;"></button>' +
								actions +
							'</ul>' +
						'</li>' +
						'<li class="ggrid-pager-middle">' +
							'<i id="first_pager_' + instance.idReal + '" class="fa fa-fast-backward"></i>' +
							'<i id="prev_pager_' + instance.idReal + '" class="fa fa-backward"></i>' +

							'<span style="margin-left: 5px;"> P&aacute;gina </span>' +
							'<span id="span_current_page_' + instance.idReal + '"> ' + ( json.data[ data.key ].page * 1 ) + ' </span>' +
							'<psna> de </span>' +
							'<span style="margin-right: 7px;" id="span_top_page_' + instance.idReal + '"> ' + ( json.data[ data.key ].records == 0 ? 0 : json.data[ data.key ].pages * 1 ) + ' </span>' +

							'<i id="next_pager_' + instance.idReal + '" class="fa fa-forward"></i>' +
							'<i id="last_pager_' + instance.idReal  + '" class="fa fa-fast-forward"></i>' +
							'<select id="ddl_pages_' + instance.idReal + '">' +
								'<option role="option" value="10" selected="selected">10</option>' +
								'<option role="option" value="20">20</option>' +
								'<option role="option" value="30">30</option>' +
								'<option role="option" value="40">40</option>' +
								'<option role="option" value="50">50</option>' +
							'</select>' +
						'</li>' +
						'<li style="text-align: right;">' +
							'<span>Registros: </span>' +
							'<span id="span_total_records_' + instance.idReal + '">' + ( json.data[ data.key ].records * 1 ) + '</span>' +
						'</li>' +
					'</ul>' +
				'</div>' +
				'<div style="clear: both;"></div>'
			);

			//Evento de las acciones.
			$( "#div_grid_" + instance.idReal + " .ggrid-actions li" ).each(function(){
				$(this).on("click", function(){
					if( instance[ $(this).attr("act_id") ] )
						instance[ $(this).attr("act_id") ]();
				});
			});

			//Desactivamos el evento de las columnas sortables.
			$( "#gview_grid_" + instance.idReal + " th[role='columnheader']" + ( instance.multiselect ? ":gt(0)" : "" ) ).on("click", function(){
				var sortname =  $(this).attr("id").replace( "grid_" + instance.idReal + "_", "" );
				var orderby = $(this).attr("orderby");

				//Validamos el ORDER BY.
				if( orderby === "ASC" )
					orderby = "DESC";
				else
					orderby = "ASC";

				sortname += " " + orderby;

				$(this).attr( "orderby", orderby );
				instance.$GGrid.attr({
					sortname: sortname
				});

				reload( null, false, instance );
			});

			//Registramos los eventos para el paginado.
			$( "#prev_pager_" + instance.idReal ).on("click", function(){
				prevPage( instance );
			});

			$( "#next_pager_" + instance.idReal ).on("click", function(){
				nextPage( instance );
			});

			$( "#first_pager_" + instance.idReal ).on("click", function(){
				firstPage( instance );
			});

			$( "#last_pager_" + instance.idReal ).on("click", function(){
				lastPage( instance );
			});

			//Evento para las páginas.
			$( "#ddl_pages_" + instance.idReal ).on("change", function(){
				instance.rows = this.value;

				reload( null, false, instance );
			});

			//Evento para los filtros.
			if( instance.autofilter )
			{
				var $GFilters = instance.$GGrid.prev();

				$GFilters.find("input, select, checkbox, radio").on("change", function(){
					reload( _utils.getParams( $GFilters ), false, instance );
				});
			}

			//Modificamos estilos.
			modify( instance );

			//Resize.
			//resize( instance );
		} );
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

	//Función para modificar estilos.
	function modify( pInstance )
	{
		//Modificamos los estilos del grid.
		var $GGrid = $( "#div_grid_" + pInstance.idReal );

		$GGrid.find(".ui-widget-header").removeClass("ui-widget-header");
		$GGrid.find(".ui-state-default").removeClass("ui-state-default");

		//Fondo del grid.
		$GGrid.find( "#gbox_grid_" + pInstance.idReal ).removeClass("ui-widget-content");
		$GGrid.find( ".ui-jqgrid-hdiv" ).removeClass("ui-state-default");
		$GGrid.find( ".ui-widget-content" ).removeClass("ui-widget-content");
		$GGrid.find( ".ui-jqgrid-hdiv" ).addClass("ggrid-header");
		$GGrid.find( "spans" ).remove();
		$GGrid.addClass("ggrid-real");

		$GGrid.find("table.ui-jqgrid-btable tbody tr").each(function(index){
			$(this).css({
				background: index % 2 == 0 ? "#fff" : "#F8F8F8"
			});
		});
	}

	//Función para recargar el GGrid.
	function reload( pParams, pMantenerPaginado, pInstance )
	{
		var instance = pInstance ? pInstance : thisx[ this.id ];

		var slt = "";
		var opcMantenerPaginado = pMantenerPaginado == undefined || pMantenerPaginado == "undefined" ? false : pMantenerPaginado;

		instance.$GGrid.find("column").each(function(){
			if( slt != "" )
				slt += ", ";

			slt += $.trim( $(this).attr("field") );
		});

		if( pParams )
			instance.params = pParams;

		//Si aún no existe el grid, entonces se manda a crear.
		if( $( "#div_grid_" + instance.idReal ).size() == 0 )
			create( instance );
		else
		{
			var parametros = buildParams( instance );

			parametros.slt = slt;

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

			parametros.rows = instance.rows;
			parametros.page = instance.page;

			loadGrid(instance, parametros, function( json ){
				var data = dataFormat( instance, json.data );

				$( "#grid_" + instance.idReal )
					.jqGrid("clearGridData")
					.jqGrid("setGridParam", {
						datatype: "local",
						data: data.dataFormated,
						rowNum: parametros.rows
				}).trigger("reloadGrid");

				$( "#span_current_page_" + instance.idReal ).text( ( json.data[ data.key ].records == 0 ? 0 : json.data[ data.key ].page * 1 ) );
				$( "#span_top_page_" + instance.idReal ).text( json.data[ data.key ].pages * 1 );
				$( "#span_total_records_" + instance.idReal ).text( json.data[ data.key ].records * 1 );

				//modify( instance );
			});
		}
	}

	//Función para consultar los registros del GGrid.
	function loadGrid( pInstance, pParams, pCallback )
	{
		//Hacemos la petición.
		_ajax({
			id: "pet" + pInstance.idReal,
			path: pInstance.path,
			params: pParams,
			callback: function( json ){
				pCallback( json );
			}
		});
	}

	//Función para construir los parámetros.
	function buildParams( pInstance )
	{
		//Armamos los parámetros.
		var params = pInstance.params;

		params.grid = 1;
		params.sidx = pInstance.sidx

		return params;
	}

	//Función para formatear el json que recibe el GGrid.
	function dataFormat( pInstance, pData )
	{
		//Armamos el array para el grid.
		var keys = new Array();
		for( var key in pData )
		{
			keys.push( key );
		}

		pInstance.pages = pData[ keys[0] ].pages * 1;

		return {
			dataFormated: pData[ keys[0] ].data,
			key:  keys[0]
		};
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
		instance.groping = false;
		instance.groupingView = "";
		instance.groupCollapse = false;
		instance.groupText = "";
		instance.onSelect = null;
		instance.onLoadComplete = null;
		instance.onDblClick = null;
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
			var array_params = ( instance.$GGrid.attr("params") ? $.trim( instance.$GGrid.attr("params") ) : "" ).split("&");
			var array_param = null;
			instance.params = {};

			for( var x=0; x<array_params.length; x++ )
			{
				array_param = array_params[x].split("=");
				instance.params[ $.trim( array_param[0] ) ] = $.trim( array_param[1] );
			}
		}

		//Establecemos el path, el params y el sidx.
		instance.path = _config.paths.AppService + ( instance.path ? instance.path : instance.$GGrid.attr("path") );
		instance.sidx = instance.sortname ? instance.sortname : instance.$GGrid.find("column:first").attr("field");
	}

	//Función para obtener valores del GGrid.
	function getValue( pValue, pFnc )
	{
		var instance = thisx[ this.id ];

		if( pValue === "row" )
			return getRow( instance, pFnc );
	}

	//Función para obtener el row seleccionado.
	function getRow( pInstance, pFnc )
	{
		var rowSelected = false;

		//Validamos si es multiselect
		if( !pInstance.multiselect )
		{
			var row = pInstance.$GGridReal.jqGrid( "getGridParam", "selrow" );

			if( row )
				rowSelected = pInstance.$GGridReal.jqGrid( "getRowData", row );
			else
			{
				_gmessage.warning( "Debe seleccionar un rengl&oacute;n." );
				rowSelected = false;
			}
		}
		else
		{
			var idRows = $( "#grid_" + pInstance.idReal ).jqGrid( "getGridParam", "selarrrow" );

			if( idRows.length > 0 )
			{
				rowSelected = new Array();

				for( var x=0; x<idRows.length; x++ )
					rowSelected[x] = pInstance.$GGridReal.jqGrid( "getRowData", idRows[x] );
			}
			else
			{
				_gmessage.warning( "Debe seleccionar un rengl&oacute;n." );
				rowSelected = false;
			}
		}

		if( rowSelected && pFnc )
			pFnc( rowSelected );

		return rowSelected;
	}

	//FUNCIONES PÚBLICAS.
	GGrid.prototype =  Object.create(Object.prototype, {
		create: { writable: false, enumerable: false, configurable: false, value: create },
		getValue: { writable: false, enumerable: false, configurable: false, value: getValue },
		reload: { writable: false, enumerable: false, configurable: false, value: reload }
	});

	window.GGrid = GGrid;
})($);
