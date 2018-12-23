(function() {
'use strict';

angular.module('core').directive('lmPrint', [ 
    function () {
        var printSection = angular.element('[print-section]');
        if(!printSection.length){
            printSection =  angular.element('body').attr('print-section', true);
        }
        
        
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {

                element.on('click', function () {
                    window.print();
                });
            }
        };
	}
]);
})();
