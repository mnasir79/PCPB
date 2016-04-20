'use strict';

/**
 * @ngdoc function
 * @name app.controller: backgroundCtrl
 * @description
 * # backgroundCtrl
 * Controller of the app
**/

angular.module('app', ['cicService'])
    .controller('backgroundCtrl', function ($scope, $log, cicService) {

        $scope.isCICConnected = function () {
            return cicService.isCICConnected;
        }
        
        $scope.setIsCICConnected = function (val) {
            cicService.isCICConnected = val;
        }
    });