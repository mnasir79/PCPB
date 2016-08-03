'use strict';

/**
 * @ngdoc function
 * @name app.controller: backgroundCtrl
 * @description
 * # backgroundCtrl
 * Controller of the app
**/

angular.module('app', ['cicService'])
    .controller('backgroundCtrl', function ($scope, $log, $interval, cicService,$window) {

        var CICTimer;

        $scope.getCICService = function () {
            return cicService;
        };

        $scope.StartTimer_CIC = function () {
            $interval.cancel(CICTimer);
            CICTimer = $interval(function () {
                cicService.GetMessage();
            }, cicService.GetTimer());
        };

        $scope.StopTimer_CIC = function () {
            $interval.cancel(CICTimer);
        };

        $scope.ShowMessage = function (sMessage) {
            var r = confirm(sMessage);
            if (r === true) {
                var x = screen.width/2 - 800/2;
                var y = screen.height/2 - 400/2;
                $window.open('options.html', '_Blank', 'toolbar=no, modal=yes, alwaysRaised=yes, width=800,height=400, top=' + y + ' left=' + x);
            }
        };

    });