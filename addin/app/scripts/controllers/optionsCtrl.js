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
    
    
    
    $scope.pcAuthUrl = "http://cupa";
    $scope.pcAccessTokenUrl = "fttp://access.kuuppaa";
    $scope.pcClientId = "Cliento";
    $scope.pcClientSecret = "secreto";
    
    $scope.kupa = 'yo man';
  });