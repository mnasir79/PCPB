'use strict';

/**
 * @ngdoc function
 * @name app.controller:popupCtrl
 * @description
 * # popupCtrl
 * Controller of the app
**/

angular.module('app', ['cicService'])
    .directive('loading', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<img class="loading" src="http://www.nasa.gov/multimedia/videogallery/ajax-loader.gif" width="14" height="14" align="right" />',
            link: function (scope, element, attr) {
                scope.$watch('loading', function (val) {
                    if (val)
                        $(element).show();
                    else
                        $(element).hide();
                });
            }
        }
    })

    .controller('popupCtrl', function ($rootScope, $scope, $log, cicService) {

         var _BgController;

        function init() {
            var bgPage = chrome.extension.getBackgroundPage();
            _BgController = bgPage.getController();
            $scope.isCICConnected = _BgController.getCICService().getIsConnected();
               
        }

        init();

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
                $scope.loading = true;
                try {
                    _BgController.getCICService().Login().then(function success(response) {
                        $scope.loading = false;
                        $scope.isCICConnected = true;
                        $scope.$apply();

                    }, function error(response) {
                        $scope.loading = false;
                        $scope.isCICConnected = false;
                        $scope.$apply();
                    });
                } catch (Err) {
                    $log.debug(Err);
                    $scope.loading = false;
                }
            };
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