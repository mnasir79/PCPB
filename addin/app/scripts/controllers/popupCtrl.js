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
      console.log('message from testLog');
      try {
        $log.isEnabled;
      } catch (error) {
        console.log(error);
      }
      $log.debug(message);
    }
  });