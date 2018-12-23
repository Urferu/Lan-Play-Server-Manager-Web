(function() {
	'use strict';
	// Factory para automatizar el manejo de erroes y mensajes en las peticiones http
	// Luis Hernandez

	angular.module('core').service('req', ['$http', '$q', 'Config', 'growl', 'blockUI', function($http, $q, Config, growl, blockUI) {
		var regExpQSP = /([^?=])=([^&]*)/;
		var cancelers = {};
		var thisService = this;

		var validateResponse = function(pResponse, pCallback){
			var meta = {};
			var data = {};
			blockUI.stop();
			if( pResponse.data && typeof( pResponse.data ) === 'object' )
			{
				if(pResponse.data.meta){
					if( pResponse.data.meta.isBROk === undefined || pResponse.data.meta.isBROk === 'unefined' )
					{
						meta.isBROk = pResponse.data.data.isBROk;
						meta.message = pResponse.data.data.message;
					}
					else
					{
						meta.isBROk = pResponse.data.meta.isBROk;
						meta.message = pResponse.data.meta.message;
					}
					data = pResponse.data.data;
				}
				else{
					meta.isBROk = true;
					data = pResponse.data;
				}
			}

			if( pResponse.status == 200  || pResponse.status == 'Ok.' )
			{
				//Reglas de negocio bien.
				if( meta.isBROk || meta.isBROk === undefined || meta.isBROk === 'undefined' )
				{

					if( meta.message ) 
					{
						setTimeout(function(){
							growl.success(meta.message, {ttl: 4000});
					 	}, 200);
					}

					if( pCallback )
						pCallback( pResponse.data );
				}
				else
				{
					//Reglas de negocio mal.
					if( meta.message )
					{
						setTimeout(function(){
					 		growl.info(meta.message, {ttl: 10000});
					 	}, 200);
					}
				}
			}
			else
			{
				if( meta.message )
				{
					setTimeout(function(){
						growl.warning(meta.message, {ttl: 6000});
					}, 200);
				}
				else if( pResponse.data && pResponse.data.data && pResponse.data.data.userMessage )
				{
					setTimeout(function(){
						growl.warning(pResponse.data.data.userMessage, {ttl: 6000});
					}, 200);
				}
				else
				{
					if( pCallback )
						pCallback( pResponse );
				}
			}
		};

		//cancels the request based on the requestName, in case the request name is
		//not defined it cancels all the request's
		this.cancelRequests = function(requestName){
			if(requestName){
				if(cancelers[requestName]){
					cancelers[requestName].resolve();
				}
			}
			else{
				Object.keys(cancelers).map(function(reqName, index) {
					cancelers[reqName].resolve();
				});
			}
		};

		this.get = function(pUri, pParams, callback, handler, pApi) {
			var uri = pUri;
			var paramsGet = {};
			var reqName = (uri + handler + "Get").split("?")[0].replace(/\//g,"").replace(/&/g, "").
				replace(/\?/g, "").replace(/=/g,"").replace(/%/g, "");

			var api = Config["api" + Config.ambiente];

			if(pApi){
				api = pApi;
			}

			if(pParams._reqName){
				reqName = pParams._reqName;
				delete pParams._reqName;
			}
			if(cancelers[reqName]){
				cancelers[reqName].resolve();
			}
			delete cancelers[reqName];
			cancelers[reqName] = $q.defer();
			paramsGet.timeout = cancelers[reqName].promise;
			
			if( handler ) 
			{
				var validHanler = regExpQSP.test( pUri );
				
				if( validHanler )
				{
					uri = pUri + '&_handler=' + handler;
				}
				else
				{
					uri = pUri + '?_handler=' + handler;
				}

				uri += '&'
			}
			else
				uri += '?'
			
			uri = api + uri + ( pParams ? $.param(pParams) : '' );

			if( !pParams || pParams._showWait === true ){
				blockUI.start('Espere, por favor...');
				delete pParams._showWait;
			}

			$http.get(uri, paramsGet).then(function (response) {
				if(cancelers[reqName]){
					delete cancelers[reqName];
				}
				validateResponse( response, callback );
			}, function (response) {
				if(cancelers[reqName]){
					delete cancelers[reqName];
				}
				validateResponse( response, callback );
			});
		};
		this.post = function (uri, data, config, callback, handler, pApi) {
			var api = Config["api" + Config.ambiente];
			var reqName = (uri + handler + "Get").split("?")[0].replace(/\//g,"").replace(/&/g, "").
				replace(/\?/g, "").replace(/=/g,"").replace(/%/g, "");
			if(pApi){
				api = pApi;
			}

			if (!callback) {
				callback = config;
				config = {}
			}

			if(data._reqName){
				reqName = data._reqName;
				delete data._reqName;
			}
			if(cancelers[reqName]){
				cancelers[reqName].resolve();
			}
			delete cancelers[reqName];
			cancelers[reqName] = $q.defer();
			config.timeout = cancelers[reqName].promise;

			if ( handler ) {
				uri = uri + '?_handler=' + handler;
			}

			if( !data || data._showWait === true ){
				blockUI.start('Espere, por favor...');
				delete data._showWait;
			}
			
			$http.post(api + uri, data, config).then(function (response) {
				if(cancelers[reqName]){
					delete cancelers[reqName];
				}
				validateResponse( response, callback );
			}, function (response) {
				if(cancelers[reqName]){
					delete cancelers[reqName];
				}
				validateResponse( response, callback );
			});
		};
		this.put = function (uri, data, config, callback, handler, pApi) {
			var api = Config["api" + Config.ambiente];
			var reqName = (uri + handler + "Get").split("?")[0].replace(/\//g,"").replace(/&/g, "").
				replace(/\?/g, "").replace(/=/g,"").replace(/%/g, "");
			if(pApi){
				api = pApi;
			}

			if (!callback) {
				callback = config;
				config = {}
			}

			if(data._reqName){
				reqName = data._reqName;
				delete data._reqName;
			}
			if(cancelers[reqName]){
				cancelers[reqName].resolve();
			}
			delete cancelers[reqName];
			cancelers[reqName] = $q.defer();
			config.timeout = cancelers[reqName].promise;

			if ( handler ) {
				uri = uri + '?_handler=' + handler;
			}

			if( !data || data._showWait === true ){
				blockUI.start('Espere, por favor...');
				delete data._showWait;
			}

			$http.put(api + uri, data, config).then(function (response) {
				if(cancelers[reqName]){
					delete cancelers[reqName];
				}
				validateResponse( response, callback );
			}, function (response) {
				if(cancelers[reqName]){
					delete cancelers[reqName];
				}
				validateResponse( response, null );
			});
		};
		this.delete = function(pUri, pParams, callback, handler, pApi){
			var uri = pUri;
			var paramsDelete = {};
			var reqName = (uri + handler + "Get").split("?")[0].replace(/\//g,"").replace(/&/g, "").
				replace(/\?/g, "").replace(/=/g,"").replace(/%/g, "");

			var api = Config["api" + Config.ambiente];

			if(pApi){
				api = pApi;
			}

			if(pParams._reqName){
				reqName = pParams._reqName;
				delete pParams._reqName;
			}
			if(cancelers[reqName]){
				cancelers[reqName].resolve();
			}
			delete cancelers[reqName];
			cancelers[reqName] = $q.defer();
			paramsDelete.timeout = cancelers[reqName].promise;

			if( handler ) 
			{
				var validHanler = regExpQSP.test( pUri );
				
				if( validHanler )
				{
					uri = pUri + '&_handler=' + handler;
				}
				else
				{
					uri = pUri + '?_handler=' + handler;
				}

				uri += '&'
			}
			else
				uri += '?'
			
			uri = api + uri + ( pParams ? $.param(pParams) : '' );

			if( !pParams || pParams._showWait === true ){
				blockUI.start('Espere, por favor...');
				delete pParams._showWait;
			}

			$http.delete(uri, paramsDelete).then(function (response) {
				if(cancelers[reqName]){
					delete cancelers[reqName];
				}
				validateResponse( response, callback );
			}, function (response) {
				if(cancelers[reqName]){
					delete cancelers[reqName];
				}
				validateResponse( response, null );
			});
		};
	}]);
})();
