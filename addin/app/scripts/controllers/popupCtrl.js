'use strict';

/**
 * @ngdoc function
 * @name app.controller:popupCtrl
 * @description
 * # popupCtrl
 * Controller of the app
**/

angular.module('app', [])
    .controller('popupCtrl', function ($scope, $log) {

        var _BgController;

        function loginCIC() {
            // Login
            $scope.cicLoading = true;
            try {
                _BgController.getCICService().Login().then(function success() {
                    $scope.cicLoading = false;
                    $scope.isCICConnected = true;
                    $scope.$apply();

                    // Subscribe for messages & start Timer
                    _BgController.getCICService().Subscribe().then(function success(params) {
                        _BgController.StartTimer_CIC();
                    }, function error(params) {
                        $log.error('Cannot subscribe for notifications');
                    });
                }, function error() {
                    $scope.cicLoading = false;
                    $scope.isCICConnected = false;
                    $scope.$apply();
                });
            } catch (Err) {
                $log.error(Err);
                $scope.cicLoading = false;
            }
        }

        function init() {
            var bgPage = chrome.extension.getBackgroundPage();
            _BgController = bgPage.getController();
            if (_BgController.getCICService().getIsConnected()) {
                // Check conenction state
                try {
                    _BgController.getCICService().ShouldReconnect().then(function success(response) {
                        if (response) {
                            loginCIC();
                        } else {
                            $scope.isCICConnected = true;
                            $scope.$apply();
                        }
                    }, function error() {
                        loginCIC();
                    });
                } catch (Err) {
                    $log.error(Err);
                }
            } else {
                // Display NotConnected State
                $scope.isCICConnected = false;
            }
        }
        init();

        $scope.togglePCConnectionIndicator = function () {
            if ($scope.isPCConnected) {
                $scope.isPCConnected = false;
            }
            else {
                $scope.isPCConnected = true;
            }
        };

        $scope.toggleCICConnectionIndicator = function () {
            if ($scope.isCICConnected) {
                // LogOff
                $scope.cicLoading = true;
                _BgController.StopTimer_CIC();
                try {
                    _BgController.getCICService().Logoff().then(function success() {
                        $scope.cicLoading = false;
                        $scope.isCICConnected = false;
                        $scope.$apply();
                    }, function error() {
                        $scope.cicLoading = false;
                        $scope.isCICConnected = false;
                        $scope.$apply();
                    });
                } catch (Err) {
                    $log.error(Err);
                    $scope.cicLoading = false;

                }
            }
            else {
                loginCIC();
            }
        };

        $scope.togglePowerBIConnectionIndicator = function () {
            if ($scope.isPowerBIConnected) {
                $scope.isPowerBIConnected = false;
            }
            else {
                $scope.isPowerBIConnected = true;
            }
        };

        $scope.openUrl = function (obj) {
            var url = obj.target.attributes.href.value;
            chrome.tabs.create({ url: url });
        };
    });