'use strict';

angular.module('consumptions').filter('dynamicFilter', ["$filter", function($filter) {
  return function(value, filter) {
    if(filter){
      var args = filter.split(":");
      var filterName = args.shift();
      args.unshift(value);
      return $filter(filterName).apply(null, args);
    }

    return value;
  };
}]);
