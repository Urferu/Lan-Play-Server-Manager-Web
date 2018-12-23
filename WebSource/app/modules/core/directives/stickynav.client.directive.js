(function() {
'use strict';
angular.module('core').directive('stickyNav', ['$window', function stickyNav($window){
  function stickyNavLink(scope, element){
    var w = angular.element($window),
        size = element[0].clientHeight,
        top = 0;

    /*
     * on scroll we just check the page offset
     * if it's bigger than the target size we fix the controls
     * otherwise we display them inline
     */
    function toggleStickyNav(){
      // console.log("win:"+$window.pageYOffset);
      // console.log("top:"+top);
      // console.log("size:"+size);
      if(!element.hasClass('display') && $window.pageYOffset > top + size){
        element.addClass('display');
      } else if(element.hasClass('display') && $window.pageYOffset <= top + size){
        element.removeClass('display');
      }
    }

    /*
     * We update the top position -> this is for initial page load,
     * while elements load
     */
    // scope.$watch(function(){
    //   return element[0].getBoundingClientRect().top + $window.pageYOffset;
    // }, function(newValue, oldValue){
    //   if(newValue !== oldValue && !element.hasClass('display')){
    //   //if(newValue !== oldValue && element.hasClass('display')){
    //     top = newValue;
    //   }
    // });

    /*
     * Resizing the window displays the controls inline by default.
     * This is needed to calculate the correct boundingClientRect.
     * After the top is updated we toggle the nav, eventually
     * fixing the controls again if needed.
     */
    // w.bind('resize', function stickyNavResize(){
    //   element.removeClass('display');
    //   //element.addClass('display');
    //   top = element[0].getBoundingClientRect().top + $window.pageYOffset;
    //   toggleStickyNav();
    // });
    w.bind('scroll', toggleStickyNav);
  }

  return {
    scope: {},
    restrict: 'A',
    link: stickyNavLink
  };
}]);
})();