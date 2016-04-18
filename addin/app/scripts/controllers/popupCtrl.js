'use strict';

/**
 * @ngdoc function
 * @name app.controller:PopupCtrl
 * @description
 * # PopupCtrl
 * Controller of the app
**/

angular.module('app', [])
  .controller('PopupCtrl', function($rootScope, $scope, $log) {
    
    $scope.testLog = function(message) {
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