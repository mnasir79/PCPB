'use strict';

/**
 * @ngdoc function
 * @name app.controller: backgroundCtrl
 * @description
 * # backgroundCtrl
 * Controller of the app
**/

angular.module('app', ['cicService', 'jsonTranslator'])
    .controller('backgroundCtrl', function ($scope, $log, $interval, cicService, jsonTranslator) {

        var CICTimer;

        jsonTranslator.dupa();
        $scope.getCICService = function () {
            return cicService;
        };

        $scope.StartTimer_CIC = function () {
            $interval.cancel(CICTimer);
            CICTimer = $interval(function () {
                cicService.GetMessage();
            }, 5000);
        }

        $scope.StopTimer_CIC = function () {
            $interval.cancel(CICTimer);
        }


    });