'use strict';

/**
 * @ngdoc function
 * @name app.controller:popupCtrl
 * @description
 * # popupCtrl
 * Controller of the app
**/

angular.module('app', ['powerbiService'])
    .controller('popupCtrl', function ($scope, $log, powerbiService) {
        
        $scope.togglePCConnectionIndicator = function (obj) {
            if ($scope.isPCConnected) {
                $scope.isPCConnected = false;
            }
            else {
                $scope.isPCConnected = true;
            }
        }

        $scope.togglePowerBIConnectionIndicator = function () {
            if ($scope.isPowerBIConnected) {
                // LogOff
                $scope.powerbiLoading = true;
                try {
                    powerbiService.Logoff().then(function success() {
                        $scope.powerbiLoading = false;
                        $scope.isPowerBIConnected = false;
                        $scope.$apply();
                    }, function error() {
                        $scope.powerbiLoading = false;
                        $scope.isPowerBIConnected = false;
                        $scope.$apply();
                    });
                } catch (Err) {
                    $log.error(Err);
                    $scope.powerbiLoading = false;
                }
            }
            else {
                //loginPowerBI();
            }
        };

        $scope.sendToPowerBI = function(dataset, table, rows) {
          powerbiService.SendToPowerBI(dataset, table, rows);
        }

        $scope.openUrl = function (obj) {
            var url = obj.target.attributes.href.value;
            chrome.tabs.create({ url: url });
        }
    });