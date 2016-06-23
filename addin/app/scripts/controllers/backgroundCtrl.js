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
         var sourceCic = JSON.parse('[{"statisticKey":{"statisticIdentifier":"inin.workgroup:AgentsLoggedIn","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"Marketing"}]},"statisticValue":{"__type":"urn:inin.com:statistics:statisticIntValue","value":0,"statisticValueType":0}},{"statisticKey":{"statisticIdentifier":"inin.workgroup:TotalAgents","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"Marketing"}]},"statisticValue":{"__type":"urn:inin.com:statistics:statisticIntValue","value":2,"statisticValueType":0}},{"statisticKey":{"statisticIdentifier":"inin.workgroup:TotalAgents","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"GroupA"}]},"statisticValue":{"__type":"urn:inin.com:statistics:statisticIntValue","value":1,"statisticValueType":0}},{"statisticKey":{"statisticIdentifier":"inin.workgroup:PercentAvailable","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"Marketing"}]},"statisticValue":{"__type":"urn:inin.com:statistics:statisticPercentValue","value":0,"statisticValueType":9}},{"statisticKey":{"statisticIdentifier":"inin.workgroup:NumberAvailableForACDInteractions","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"Marketing"}]},"statisticValue":null},{"statisticKey":{"statisticIdentifier":"inin.workgroup:InteractionsWaiting","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"Marketing"}]},"statisticValue":{"__type":"urn:inin.com:statistics:statisticIntValue","value":0,"statisticValueType":0}},{"statisticKey":{"statisticIdentifier":"inin.workgroup:InteractionsWaiting","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"GroupA"}]},"statisticValue":{"__type":"urn:inin.com:statistics:statisticIntValue","value":0,"statisticValueType":0}}]');        
        var cicOut = jsonTranslator.translateCicStatSet(sourceCic);
        console.debug(JSON.stringify(cicOut));

        var sourcePc = JSON.parse('{"results": [{"group": {"queueId": "d7b99d1c-4833-4ad6-aa87-d1a23dba13d4"},"data": [{"metric": "oActiveUsers","stats": {"count": 5}},{"metric": "oMemberUsers","stats": {"count": 5}}]},{"group": {"mediaType": "voice","queueId": "d7b99d1c-4833-4ad6-aa87-d1a23dba13d4"},"data": [{"metric": "oInteracting","stats": {"count": 0}},{"metric": "oWaiting","stats": {"count": 0}}]},{"group": {"mediaType": "chat","queueId": "d7b99d1c-4833-4ad6-aa87-d1a23dba13d4"},"data": [{"metric": "oInteracting","stats": {"count": 0}},{"metric": "oWaiting","stats": {"count": 0}}]},{"group": {"mediaType": "email","queueId": "d7b99d1c-4833-4ad6-aa87-d1a23dba13d4"},"data": [{"metric": "oInteracting","stats": {"count": 0}},{"metric": "oWaiting","stats": {"count": 0}}]},{"group": {"mediaType": "callback","queueId": "d7b99d1c-4833-4ad6-aa87-d1a23dba13d4"},"data": [{"metric": "oInteracting","stats": {"count": 0}},{"metric": "oWaiting","stats": {"count": 0}}]}]}');

        var pcOut = jsonTranslator.translatePcStatSet(sourcePc);
        console.debug(JSON.stringify(pcOut));        
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