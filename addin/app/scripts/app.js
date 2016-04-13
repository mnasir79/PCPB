'use strict';

/**
 * @ngdoc overview
 * @name app
 * @description
 * # app
 *
 * Main module of the application.
 */

angular.module('app', [
  'loggerProvider'
  ])
  .factory('$log', function(logger) {
    return logger;
  })
  .run(function($rootScope, $log) {
    $rootScope.$log = $log;
    $log.setLevel(log4javascript.Level.ALL);
    $log.setLocalStorageEnabled(false);
  });