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

var CSS_CLASS_CONNECTED = 'label-success';
var CSS_CLASS_DISCONNECTED = 'label-danger';

var background = chrome.extension.getBackgroundPage();

function setConnected(id) {
    var arr = id.split('_');
    var id = "connectionIndicator_" + arr[1];
    var jquery_id = '#' + id;
    $(jquery_id).removeClass(CSS_CLASS_DISCONNECTED);
    $(jquery_id).addClass(CSS_CLASS_CONNECTED);
    background.cssClass[id] = CSS_CLASS_CONNECTED;
    console.log(id + ' changed from disconnected to connected');
}

function setDisconnected(id) {
    var arr = id.split('_');
    var id = "connectionIndicator_" + arr[1];
    var jquery_id = '#' + id;
    $(jquery_id).removeClass(CSS_CLASS_CONNECTED);
    $(jquery_id).addClass(CSS_CLASS_DISCONNECTED);
    background.cssClass[id] = CSS_CLASS_DISCONNECTED;
    console.log(id + ' changed from connected to disconnected');
}

function initConnectionIndicator(id) {
    if (typeof background.cssClass[id] == 'undefined') {
        background.cssClass[id] = CSS_CLASS_DISCONNECTED;
    }
    else if (background.cssClass[id] == CSS_CLASS_DISCONNECTED) {
        setDisconnected(id);
    }
    else if (background.cssClass[id] == CSS_CLASS_CONNECTED) {
        setConnected(id);
    }
}