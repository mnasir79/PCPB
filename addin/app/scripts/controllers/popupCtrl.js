'use strict';

/**
 * @ngdoc function
 * @name app.controller:popupCtrl
 * @description
 * # popupCtrl
 * Controller of the app
**/

angular.module('app', [])
    .controller('popupCtrl', function ($rootScope, $scope, $log) {

        $scope.togglePCConnectionIndicator = function (obj) {
            if ($scope.isPCConnected) {
                $scope.isPCConnected = false;
            }
            else {
                $scope.isPCConnected = true;
            }
        }

        $scope.toggleCICConnectionIndicator = function (obj) {
            if ($scope.isCICConnected) {
                $scope.isCICConnected = false;
            }
            else {
                $scope.isCICConnected = true;
            }
        }

        $scope.togglePowerBIConnectionIndicator = function (obj) {
            if ($scope.isPowerBIConnected) {
                $scope.isPowerBIConnected = false;
            }
            else {
                $scope.isPowerBIConnected = true;
            }
        }

        $scope.openUrl = function (obj) {
            var url = obj.target.attributes.href.value;
            chrome.tabs.create({ url: url });
        }
    });