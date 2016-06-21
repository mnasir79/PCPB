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
        }

        $scope.openUrl = function (obj) {
            var url = obj.target.attributes.href.value;
            chrome.tabs.create({ url: url });
        }
    });