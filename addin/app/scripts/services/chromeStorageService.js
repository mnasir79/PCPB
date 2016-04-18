'use strict';

/**
 * @ngdoc function
 * @name chromeStorageService
 * @description
 * # chromeStorageService
 **/

angular.module('app')
  .service('chromeStorageService', function($log) {
                        
      this.getPcOptions = function (callback) {        

            var _pcSettings = new Object();
                _pcSettings.pcAuthUrl = "enter auth url";
                _pcSettings.pcAccessTokenUrl = "enter access token url";
                _pcSettings.pcClientId = "enter client id";
                _pcSettings.pcClientSecret = "enter client secret";
                callback(_pcSettings);
                                                
        chrome.storage.local.get('pcOptions', function(o) {            
            if (o == undefined){                                
                var _pcSettings = new Object();
                _pcSettings.pcAuthUrl = "enter auth url";
                _pcSettings.pcAccessTokenUrl = "enter access token url";
                _pcSettings.pcClientId = "enter client id";
                _pcSettings.pcClientSecret = "enter client secret";
                callback(_pcSettings);                   
            } else {
                callback(o);
            }                                 
        });      
      }
      
      this.setPcOptions = function (pcOptions) {
        chrome.storage.local.set('pcOptions', pcOptions);                  
      }       
  });