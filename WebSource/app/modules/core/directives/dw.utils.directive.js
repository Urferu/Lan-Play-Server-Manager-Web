angular.module('core').directive('dvPageContent', function() {
    return {
        restrict: 'C',
        link: function(scope, element) {
            element.addClass("col-xs-12 col-sm-12 col-md-9 col-md-offset-1");
        }
    }
});

angular.module('core').directive('dvPageHeader', function() {
    return {
        restrict: 'E',
        scope: {
            title: '@'
        },
        template: '<div class="page-header">' +
            '<h1>{{title}}</h1>' +
            '</div>'
    }
});

angular.module('core').directive('dvFormGroup', function() {
    return {
        restrict: 'C',
        link: function(scope, element) {
            element.addClass("col-xs-12 col-sm-12 col-md-6 col-lg-6");
        }
    }
});

angular.module('core').directive('ggFilters', function() {
    return {
        restrict: 'C',
        link: function(scope, element) {
            element.addClass("clearfix");
        }
    }
});

angular.module('core').directive('ggFiltersTitle', function() {
    return {
        restrict: 'E',
        template: 
            '<div class="gg-filters-title col-xs-12 col-sm-12 col-md-12 col-lg-12">' +
                '<h4>Filtros</h4>' +
                '<div class="space-6"></div>' +
            '</div>'
    }
});

angular.module('core').directive('ggFilterGroup', function() {
    return {
        restrict: 'C',
        link: function(scope, element) {
            element.addClass("col-xs-12 col-sm-12 col-md-4 col-lg-2");
        }
    }
});

angular.module('core').directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});