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
        var sourceCic = JSON.parse('[{"__type":"urn:inin.com:statistics:statisticValueMessage","isDelta":true,"statisticValueChanges":[{"statisticKey":{"statisticIdentifier":"inin.workgroup:TotalAgents","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"Marketing"}]},"statisticValue":{"__type":"urn:inin.com:statistics:statisticIntValue","value":2,"statisticValueType":0}},{"statisticKey":{"statisticIdentifier":"inin.workgroup:PercentAvailable","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"Marketing"}]},"statisticValue":{"__type":"urn:inin.com:statistics:statisticPercentValue","value":0,"statisticValueType":9}},{"statisticKey":{"statisticIdentifier":"inin.workgroup:OnInboundACDInteractions","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"Marketing"}]},"statisticValue":{"__type":"urn:inin.com:statistics:statisticIntValue","value":0,"statisticValueType":0}},{"statisticKey":{"statisticIdentifier":"inin.workgroup:NumberAvailableForACDInteractions","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"Marketing"}]},"statisticValue":{"__type":"urn:inin.com:statistics:statisticIntValue","value":1,"statisticValueType":0}},{"statisticKey":{"statisticIdentifier":"inin.workgroup:NotAvailable","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"Marketing"}]},"statisticValue":{"__type":"urn:inin.com:statistics:statisticIntValue","value":0,"statisticValueType":0}},{"statisticKey":{"statisticIdentifier":"inin.workgroup:LongestWaitTime","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"Marketing"}]},"statisticValue":null},{"statisticKey":{"statisticIdentifier":"inin.workgroup:LongestOutboundACDInteraction","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"Marketing"}]},"statisticValue":null},{"statisticKey":{"statisticIdentifier":"inin.workgroup:LongestOnHoldTime","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"Marketing"}]},"statisticValue":null},{"statisticKey":{"statisticIdentifier":"inin.workgroup:LongestInboundACDInteraction","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"Marketing"}]},"statisticValue":null},{"statisticKey":{"statisticIdentifier":"inin.workgroup:LongestAvailable","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"Marketing"}]},"statisticValue":{"__type":"urn:inin.com:statistics:statisticTimeDurationValue","value":"20160622T102319Z","statisticValueType":5}},{"statisticKey":{"statisticIdentifier":"inin.workgroup:InteractionsWaiting","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"Marketing"}]},"statisticValue":{"__type":"urn:inin.com:statistics:statisticIntValue","value":0,"statisticValueType":0}},{"statisticKey":{"statisticIdentifier":"inin.workgroup:InteractionsOnHold","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"Marketing"}]},"statisticValue":{"__type":"urn:inin.com:statistics:statisticIntValue","value":0,"statisticValueType":0}},{"statisticKey":{"statisticIdentifier":"inin.workgroup:InteractionsEntered","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"Marketing"},{"parameterTypeId":"ININ.Queue:Interval","value":"CurrentPeriod"}]},"statisticValue":{"__type":"urn:inin.com:statistics:statisticIntValue","value":0,"statisticValueType":0}},{"statisticKey":{"statisticIdentifier":"inin.workgroup:InteractionsAbandoned","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"Marketing"},{"parameterTypeId":"ININ.Queue:Interval","value":"CurrentPeriod"}]},"statisticValue":{"__type":"urn:inin.com:statistics:statisticIntValue","value":0,"statisticValueType":0}},{"statisticKey":{"statisticIdentifier":"inin.workgroup:AgentsLoggedIn","parameterValueItems":[{"parameterTypeId":"ININ.People.WorkgroupStats:Workgroup","value":"Marketing"}]},"statisticValue":{"__type":"urn:inin.com:statistics:statisticIntValue","value":1,"statisticValueType":0}}]}]');
        var cicOut = jsonTranslator.translateCicStatSet(sourceCic);

        console.debug(JSON.stringify(cicOut));
        // </for test only - remove it later>

        $scope.getCICService = function () {
            return cicService;
        };

        $scope.StartTimer_CIC = function () {
            $interval.cancel(CICTimer);
            CICTimer = $interval(function () {
                cicService.GetMessage();
            }, 5000);
        }

        $scope.StopTimer_CIC = function () {
            $interval.cancel(CICTimer);
        }


    });