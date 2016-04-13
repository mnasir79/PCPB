'use strict';

/**
 * @ngdoc function
 * @name app.controller:popupCtrl
 * @description
 * # popupCtrl
 * Controller of the app
**/

angular.module('app', [])
  .controller('popupCtrl', function($rootScope, $scope, $log) {
    
    $scope.testLog = function(message) {
      $log.debug(message);
    }
  });
