'use strict';

/**
 * @ngdoc function
 * @name app.controller: backgroundCtrl
 * @description
 * # backgroundCtrl
 * Controller of the app
**/

angular.module('app', ['cicService', 'jsonTranslator'])
    .controller('backgroundCtrl', function ($scope, $log, cicService, jsonTranslator) {


        jsonTranslator.dupa();
        $scope.getCICService = function () {
            return cicService;
        };

    });