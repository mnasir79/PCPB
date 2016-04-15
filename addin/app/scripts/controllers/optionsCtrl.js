'use strict';

/**
 * @ngdoc function
 * @name app.controller:optionsCtrl
 * @description
 * # optionsCtrl
 * Controller of the app
**/

angular.module('app', [])
  .controller('optionsCtrl', function($rootScope, $scope, $log) {
    
    $scope.testLog = function(message) {
      console.log('message from testLog');
      try {
        $log.isEnabled;
      } catch (error) {
        console.log(error);
      }
      $log.debug(message);
    }
    
    $scope.kupa = 'yo man';
  });