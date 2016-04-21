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

        $scope.getCICService = function() {
            return cicService;
        }
        
    });