(function() {
    'use strict';
    // Factory para el manejo de funciones de utilidad

    angular.module('core').factory('utils', ['SweetAlert',  function(SweetAlert) {
		var equals = function(a, b) {
			if (Array.isArray(a) && Array.isArray(b)) {
				if (a.length != b.length)
					return false; // not same length => not same!

				for (var i = 0; i < a.length; ++i) {
					if (!equals(a[i], b[i]))
						return false;
				}
			} else if (((typeof a == 'object') && (a !== null)) && ((typeof b == 'object') && (b !== null))) {
				var aKeys = Object.keys(a);
				var bKeys = Object.keys(b);
				if (aKeys.length != bKeys.length)
					return false; // not same length => not same!

				for (var k in a) {
					if (!equals(a[k], b[k]))
						return false;
				}
			} else {
				return a == b;
			}
			return true;
		}

		var clone = function(obj) {
			var copy;

			// Handle the 3 simple types, and null or undefined
			if (null == obj || "object" != typeof obj) return obj;

			// Handle Date
			if (obj instanceof Date) {
				copy = new Date();
				copy.setTime(obj.getTime());
				return copy;
			}

			// Handle Array
			if (obj instanceof Array) {
				copy = [];
				for (var i = 0, len = obj.length; i < len; i++) {
					copy[i] = clone(obj[i]);
				}
				return copy;
			}

			// Handle Object
			if (obj instanceof Object) {
				copy = {};
				for (var attr in obj) {
					if (attr == '$$hashKey') {
						continue;
					}

					if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
				}
				return copy;
			}

			throw new Error("Unable to copy obj! Its type isn't supported.");
		}

        var defaultAlertDelete = function (pText, pCallback) {
            SweetAlert.swal({
               title: "¿Está Seguro?",
               text: pText,
               type: "warning",
               showCancelButton: true,
               confirmButtonColor: "#DD6B55",confirmButtonText: "Aceptar",
               cancelButtonText: "Cancelar",
               closeOnConfirm: true,
               closeOnCancel: true
            }, function(isConfirm){
				if (pCallback) {
					pCallback(isConfirm);
				}
            });
		}
		
		/*
		 * Se requiere de enviar los datos del mensaje para llenar la alerta
		 * pDatosMensaje = {
		 * 	  titulo: titulo del mensaje
		 * 	  texto: texto del mensaje
		 *    mostrarCancelar: booleano que indica si se mostrará el cancelar o no
		 * 	  tipoMensaje: success, error, warning, info 
		 * }
		 */
		var defaultAlertMessage = function (pDatosMensaje, pCallback) {
			if(!pDatosMensaje.titulo){
				pDatosMensaje.titulo = 'Utilería Centralizador';
			}
			if(!pDatosMensaje.texto){
				pDatosMensaje.texto = '';
			}
			if(!pDatosMensaje.tipoMensaje){
				pDatosMensaje.tipoMensaje = 'info';
			}

			switch(pDatosMensaje.tipoMensaje){
				case 'success':
					pDatosMensaje.colorAceptar = '#619957';
					break;
				case 'warning':
					pDatosMensaje.colorAceptar = '#e6b710';
					break;
				case 'error':
					pDatosMensaje.colorAceptar = '#DD6B55';
					break;
				case 'info':
					pDatosMensaje.colorAceptar = '#448fb8';
					break;
			}
			
			if(!pDatosMensaje.textoAceptar){
				pDatosMensaje.textoAceptar = 'Aceptar';
			}

			if(!pDatosMensaje.textoCancelar){
				pDatosMensaje.textoCancelar = 'Cancelar';
			}

            SweetAlert.swal({
               title: pDatosMensaje.titulo,
               text: pDatosMensaje.texto,
               type: pDatosMensaje.tipoMensaje,
               showCancelButton: pDatosMensaje.mostrarCancelar,
			   confirmButtonColor: pDatosMensaje.colorAceptar,
			   confirmButtonText: pDatosMensaje.textoAceptar,
               cancelButtonText: pDatosMensaje.textoCancelar,
               closeOnConfirm: true,
               closeOnCancel: true
            }, function(isConfirm){
				if (pCallback) {
					pCallback(isConfirm);
				}
            });
        }
        return {
            equals: equals,
            clone: clone,
			defaultAlertDelete: defaultAlertDelete,
			defaultAlertMessage: defaultAlertMessage
        }
    }]);
})();
