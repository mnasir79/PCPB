'use strict';

/**
 * @ngdoc function
 * @name app.controller:optionsCtrl
 * @description
 * # optionsCtrl
 * Controller of the app
**/

angular.module('app', ['chromeStorage'])
  .controller('optionsCtrl',function($rootScope, $scope, $log, chromeStorage) {
        
    // <Initializing>      
    getPcOptions();
    getIcOptions();
    // </Initializing>
    
    // <PureCloud options>
    $scope.pcOptionsChanged = function(){                                
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
            $log.err(err);
        }                
    };
        
    function getPcOptions() {
        try {                       
            chromeStorage.get('pcOptions').then(function(pcOptions) {
                $scope.pcAuthUrl = pcOptions.pcAuthUrl;
                $scope.pcAccessTokenUrl = pcOptions.pcAccessTokenUrl;
                $scope.pcClientId = pcOptions.pcClientId;
                $scope.pcClientSecret = pcOptions.pcClientSecret;
            });
        }  
        catch (err) {
            $log.err(err);
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
            var storageItem = {};
            storageItem['icOptions'] = icOptions;                 
            chrome.storage.local.set(storageItem);
        } 
        catch (err) {
            $log.err(err);
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
            });
        }  
        catch (err) {
            $log.err(err);
        }         
    }
    // </CIC options>
    
  });