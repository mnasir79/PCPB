'use strict';

/**
 * @ngdoc function
 * @name app.controller:popupCtrl
 * @description
 * # popupCtrl
 * Controller of the app
**/

angular.module('app', ['cicService', 'powerbiService', 'AdalAngular'])
    .controller('popupCtrl', function ($scope, $log, cicService, powerbiService, adalAuthenticationService) {

        $scope.testLog = function (message) {
            console.log('message from testLog');
            try {
                $log.isEnabled;
            } catch (error) {
                console.log(error);
            }
            $log.debug(message);
        }

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
                //$scope.isCICConnected = false;
                cicService.Logoff();
            }
            else {
                cicService.Login();
                //$scope.isCICConnected = true;
            }
        }

        $scope.togglePowerBIConnectionIndicator = function (obj) {
            $log.info('Getting dashboards');
            adalAuthenticationService.login();
            powerbiService.getDashboards()
                .then(function(response) {
                    $log.info(response);
                })
                .catch(function(error, exception) {
                    $log.error('Error while getting dashboards');
                });
        }

        $scope.openUrl = function (obj) {
            var url = obj.target.attributes.href.value;
            chrome.tabs.create({ url: url });
        }
    });