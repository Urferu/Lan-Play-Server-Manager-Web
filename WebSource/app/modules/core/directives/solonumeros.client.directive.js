(function() {
'use strict';
angular.module('core').directive('soloNumeros', function(){
  return {
        //require: 'ngModel',
        require:'^?ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
              //console.log(text);
                if (text) {

                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }else{

                  return '';
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
}).directive('focusOn', function() {
   return function(scope, elem, attr) {
      scope.$on('focusOn', function(e, name) {
        //console.log("focusname:"+name);
        //console.log("focuson:"+attr.focusOn);
        if(name === attr.focusOn) {

          elem[0].focus();
          if(attr.type==='text'){
            elem[0].select();
          }
        }
      });
   };
})
.factory('focusElem', function ($rootScope, $timeout) {
  return function(name) {
    $timeout(function (){
      $rootScope.$broadcast('focusOn', name);
    });
  };
});
})();
