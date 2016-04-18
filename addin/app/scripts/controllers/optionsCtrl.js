'use strict';

/**
 * @ngdoc function
 * @name app.controller:optionsCtrl
 * @description
 * # optionsCtrl
 * Controller of the app
**/

angular.module('app')
  .controller('optionsCtrl',function($rootScope, $scope, $log, chromeStorageService) {
        
    // <Initializing>      
    getPcOptions();
    // </Initializing>
    
    // <PureCloud options>
    $scope.pcOptionsChanged = function(){
        var pcOptions = new Object();
        pcOptions.pcAuthUrl = $scope.pcAuthUrl;
        pcOptions.pcAccessTokenUrl = $scope.pcAccessTokenUrl;
        pcOptions.pcClientId = $scope.pcClientId;
        pcOptions.pcClientSecret = $scope.pcClientSecret;
        chromeStorageService.setPcOptions(pcOptions);
    };
        
    function getPcOptions() {  
     
        chromeStorageService.getPcOptions( function(pcOptions) {                    
            $scope.pcAuthUrl = pcOptions.pcAuthUrl;
            $scope.pcAccessTokenUrl = pcOptions.pcAccessTokenUrl;
            $scope.pcClientId = pcOptions.pcClientId
            $scope.pcClientSecret = pcOptions.pcClientSecret;
        })
    }
    // </PureCloud options>
    
  });