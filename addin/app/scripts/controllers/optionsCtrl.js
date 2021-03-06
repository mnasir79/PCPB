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

        // <PureCloud options>
        $scope.pcOptionsChanged = function(){                                
            try {
                var pcOptions = {}; 
                pcOptions.pcEnv = $scope.pcEnv;                
                pcOptions.pcTimer = $scope.pcTimer;
                pcOptions.pcClientId = $scope.pcClientId;
                pcOptions.pcClientSecret = $scope.pcClientSecret;            
                var storageItem = {};
                storageItem.pcOptions = pcOptions;                 
                chrome.storage.local.set(storageItem);
            } 
            catch (err) {
                $log.error(err);
            }                
        };
            
        function getPcOptions() {
            try {                       
                chromeStorage.get('pcOptions').then(function(pcOptions) {
                    $scope.pcEnv = pcOptions.pcEnv;
                    $scope.pcTimer = pcOptions.pcTimer;
                    $scope.pcClientId = pcOptions.pcClientId;
                    $scope.pcClientSecret = pcOptions.pcClientSecret;
                });
            }  
            catch (err) {
                $log.error(err);
            }         
        }
        // </PureCloud options>
        
        // <CIC options>
        $scope.icOptionsChanged = function(){                                
            try {
                var icOptions = {}; 
                icOptions.icIcServer = $scope.icIcServer;                
                icOptions.icPort = $scope.icPort;            
                icOptions.icUsername = $scope.icUsername;
                icOptions.icPassword = $scope.icPassword;  
                icOptions.icUseSsl = $scope.icUseSsl;     
                icOptions.icTimer = $scope.icTimer;   
                icOptions.icLimitOutput = $scope.icLimitOutput;  
                var storageItem = {};
                storageItem.icOptions = icOptions;                 
                chrome.storage.local.set(storageItem);
            } 
            catch (err) {
                $log.error(err);
            }                
        };
            
        function getIcOptions() {
            try {                       
                chromeStorage.get('icOptions').then(function(icOptions) {
                    $scope.icIcServer = icOptions.icIcServer;
                    $scope.icPort = icOptions.icPort;                
                    $scope.icUsername = icOptions.icUsername;
                    $scope.icPassword = icOptions.icPassword;
                    $scope.icUseSsl = icOptions.icUseSsl;
                    $scope.icTimer = icOptions.icTimer;
                    $scope.icLimitOutput = icOptions.icLimitOutput;
                });
            }  
            catch (err) {
                $log.error(err);
            }         
        }
        // </CIC options>

        // <Power BI options>
        $scope.pbiOptionsChanged = function () {
            try {
                var pbiOptions = {};
                pbiOptions.pbiInstance = $scope.pbiInstance;
                pbiOptions.pbiTentant = $scope.pbiTentant;
                pbiOptions.pbiClientId = $scope.pbiClientId;
                pbiOptions.pbiRedirectUri = $scope.pbiRedirectUri;
                pbiOptions.pbiEndpoint = $scope.pbiEndpoint;
                var storageItem = {};
                storageItem.pbiOptions = pbiOptions;
                chrome.storage.local.set(storageItem);
            }
            catch (err) {
                $log.error(err);
            }
        };

        function getPbiOptions() {
            try {
                chromeStorage.get('pbiOptions').then(function (pbiOptions) {
                    $scope.pbiInstance = pbiOptions.pbiInstance;
                    $scope.pbiTentant = pbiOptions.pbiTentant;
                    $scope.pbiClientId = pbiOptions.pbiClientId;
                    $scope.pbiRedirectUri = pbiOptions.pbiRedirectUri;
                    $scope.pbiEndpoint = pbiOptions.pbiEndpoint;
                });
            }
            catch (err) {
                $log.error(err);
            }
        }
        // </Power BI options>

        // <Initializing>      
        getPcOptions();
        getIcOptions();
        getPbiOptions();
        // </Initializing>

  });