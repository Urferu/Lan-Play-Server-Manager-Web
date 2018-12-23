(function() {
'use strict';


angular.module('core').controller('HomeController', ['$scope', 
    function($scope) {
        var vmHome = this;

        vmHome.titulo = 'Titulo';
    }
]);
})();