'use strict';

/**
 * @ngdoc function
 * @name app.controller:PopupCtrl
 * @description
 * # PopupCtrl
 * Controller of the app
**/

angular.module('app', [])
  .controller('PopupCtrl', function($scope, $log) {
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