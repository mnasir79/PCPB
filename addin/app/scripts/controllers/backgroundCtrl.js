'use strict';

/**
 * @ngdoc function
 * @name app.controller: backgroundCtrl
 * @description
 * # backgroundCtrl
 * Controller of the app
**/

angular.module('app', ['cicService', 'jsonTranslator'])
    .controller('backgroundCtrl', function ($scope, $log, $interval, cicService, jsonTranslator) {

        var CICTimer;

        // <for test only - remove it later>
        var sourceCic = JSON.parse('{  "data": [    {      "__type": "urn:inin.com:statistics:statisticValueMessage",      "isDelta": false,      "statisticValueChanges": [        {          "statisticKey": {            "statisticIdentifier": "inin.workgroup:AgentsLoggedIn",            "parameterValueItems": [              {                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",                "value": "Marketing"              }            ]          },          "statisticValue": {            "__type": "urn:inin.com:statistics:statisticIntValue",            "value": 1,            "statisticValueType": 0          }        },        {          "statisticKey": {            "statisticIdentifier": "inin.workgroup:TotalAgents",            "parameterValueItems": [              {                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",                "value": "Marketing"              }            ]          },          "statisticValue": {            "__type": "urn:inin.com:statistics:statisticIntValue",            "value": 2,            "statisticValueType": 0          }        }      ]    }  ]}');
        jsonTranslator.translateCicStatSet(sourceCic);
        // </for test only - remove it later>

        $scope.getCICService = function () {
            return cicService;
        };

        $scope.StartTimer_CIC = function () {
            $interval.cancel(CICTimer);
            CICTimer = $interval(function () {
                cicService.GetMessage();
            }, 5000);
        };

        $scope.StopTimer_CIC = function () {
            $interval.cancel(CICTimer);
        };


    });