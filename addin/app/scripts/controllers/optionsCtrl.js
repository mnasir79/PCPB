'use strict';

/**
 * @ngdoc function
 * @name app.controller:optionsCtrl
 * @description
 * # optionsCtrl
 * Controller of the app
**/

angular.module('app', ['chromeStorage'])
    .controller('optionsCtrl', function ($rootScope, $scope, $log, chromeStorage) {

        // <Initializing>      
        getPcOptions();
        // </Initializing>

        // <PureCloud options>
        $scope.pcOptionsChanged = function () {
            try {
                var pcOptions = {};
                pcOptions.pcAuthUrl = $scope.pcAuthUrl;
                pcOptions.pcAccessTokenUrl = $scope.pcAccessTokenUrl;
                pcOptions.pcClientId = $scope.pcClientId;
                pcOptions.pcClientSecret = $scope.pcClientSecret;
                var storageItem = {};
                storageItem['pcOptions'] = pcOptions;
                chrome.storage.local.set(storageItem);
            }
            catch (err) {
                $log.error(err);
            }
        };

        function getPcOptions() {
            try {
                chromeStorage.get('pcOptions').then(function (pcOptions) {
                    $scope.pcAuthUrl = pcOptions.pcAuthUrl;
                    $scope.pcAccessTokenUrl = pcOptions.pcAccessTokenUrl;
                    $scope.pcClientId = pcOptions.pcClientId;
                    $scope.pcClientSecret = pcOptions.pcClientSecret;
                });
            }
            catch (err) {
                $log.error(err);
            }
        }
        // </PureCloud options>

    });