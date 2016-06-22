'use strict';

/**
 * @ngdoc function
 * @name app.controller:popupCtrl
 * @description
 * # popupCtrl
 * Controller of the app
**/

angular.module('app', ['powerbiService'])
    .controller('popupCtrl', function ($scope, $log, $window, powerbiService) {

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
                // Check connection state
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
                // Logoff
                $scope.powerbiLoading = true;
                console.log('Logging off of PowerBI');
                powerbiService.Logoff(function() {
                    $scope.powerbiLoading = false;
                    $scope.isPowerBIConnected = false;
                });
            }
            else {
                // Login
                console.log('Logging in to PowerBI from angular');
                var clientId = '4f824f48-924a-44e8-aa5a-1a9383ca4810'; //TODO Get this from options
                $window.open('https://login.windows.net/common/oauth2/authorize?resource=https%3A%2F%2Fanalysis.windows.net%2Fpowerbi%2Fapi&client_id=' + clientId + '&response_type=code&redirect_uri=https://login.live.com/oauth20_desktop.srf&site_id=500453', 'name', 'height=700,width=550');
                // Rest of the login process is performed by powerbilogin.js
            }
        };

        $scope.sendToPowerBI = function(dataset, table, rows) {
          powerbiService.SendToPowerBI(dataset, table, rows);
        };

        $scope.openUrl = function (obj) {
            var url = obj.target.attributes.href.value;
            chrome.tabs.create({ url: url });
        };
    });