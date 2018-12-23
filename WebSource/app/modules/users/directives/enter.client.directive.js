(function() {
'use strict';

angular.module('users').directive('smEnter', [
  function() {
    return {
        //require: 'ngModel',
        require:'^?ngModel',
        // scope:{
        //   alias:'=ngModel'
        // },
        link: function (scope, element, attrs, ngModelCtrl) {
            element.bind('keydown keypress', function (event) {
              //console.log(event);
              //console.log(scope);
                if(event.which === 13) {
                    //console.log(ngModelCtrl.$modelValue);
                    if(ngModelCtrl.$modelValue !== undefined){
                      scope.$apply(function (){
                          scope.$eval(attrs.smEnter);
                      });
                    }
                    event.preventDefault();
                }
            });
        }
    };
  }
]);
})();
