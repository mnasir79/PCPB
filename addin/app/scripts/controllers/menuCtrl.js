'use strict';

/**
 * @ngdoc function
 * @name app.controller:menuCtrl
 * @description
 * # menuCtrl
 * Controller of the app
**/

angular.module('app', [])
  .controller('menuCtrl', function($rootScope, $scope, $log) {

   $scope.toggleConnectionIndicator = function(obj) {
        var id = obj.target.id;
        var arr = id.split('_');
        var id = "connectionIndicator_" + arr[1];
        var jquery_id = '#' + id;
        if ($(jquery_id).hasClass(CSS_CLASS_CONNECTED)) {
            setDisconnected(id)
        }
        else if ($(jquery_id).hasClass(CSS_CLASS_DISCONNECTED)) {
            setConnected(id);
        }     
    }
    
    $scope.openUrl = function(obj) {
        var url = obj.target.attributes.href.value;
        chrome.tabs.create({ url: url });    
    }
    
    initConnectionIndicator('connectionIndicator_PC');
    initConnectionIndicator('connectionIndicator_CIC');
    initConnectionIndicator('connectionIndicator_PowerBI');
    $log.debug('menu loaded succesfully'); 
    
});