'use strict';


angular.module('cicService', ['chromeStorage', 'jsonTranslator', 'powerbiService'])
  .service('cicService', function ($q, $http, $log, chromeStorage, jsonTranslator, jsonPath, powerbiService) {

    var _StatisticsJSON = [];

    // Session variables
    var _sessionId;
    var _accessToken;

    // Enviroment variables, loaded from Chrome localStorage
    var _host;
    var _port;
    var _icUsername;
    var _icPassword;
    var _icUseSsl;

    var _isConnected = false;

    function GetOptions() {
      // Load Enviroment Options from ChromeLocalStorage
      chromeStorage.get('icOptions').then(function (icOptions) {
        _host = icOptions.icIcServer;
        _port = icOptions.icPort;
        _icUsername = icOptions.icUsername;
        _icPassword = icOptions.icPassword;
        _icUseSsl = icOptions.icUseSsl;
      });


      // TEST AREA 51 ################

      var sourcePc = JSON.parse('{"results": [{"group": {"queueId": "d7b99d1c-4833-4ad6-aa87-d1a23dba13d4"},"data": [{"metric": "oActiveUsers","stats": {"count": 5}},{"metric": "oMemberUsers","stats": {"count": 5}}]},{"group": {"mediaType": "voice","queueId": "d7b99d1c-4833-4ad6-aa87-d1a23dba13d4"},"data": [{"metric": "oInteracting","stats": {"count": 0}},{"metric": "oWaiting","stats": {"count": 0}}]},{"group": {"mediaType": "chat","queueId": "d7b99d1c-4833-4ad6-aa87-d1a23dba13d4"},"data": [{"metric": "oInteracting","stats": {"count": 0}},{"metric": "oWaiting","stats": {"count": 0}}]},{"group": {"mediaType": "email","queueId": "d7b99d1c-4833-4ad6-aa87-d1a23dba13d4"},"data": [{"metric": "oInteracting","stats": {"count": 0}},{"metric": "oWaiting","stats": {"count": 0}}]},{"group": {"mediaType": "callback","queueId": "d7b99d1c-4833-4ad6-aa87-d1a23dba13d4"},"data": [{"metric": "oInteracting","stats": {"count": 0}},{"metric": "oWaiting","stats": {"count": 0}}]}]}');

      console.debug(jsonTranslator.translatePcStatSet(sourcePc));



      // TEST AREA 51 ################


    }

    this.getIsConnected = function () {
      GetOptions();
      return _isConnected;
    };




    function clearSession() {
      _sessionId = undefined;
      _accessToken = undefined;
      _isConnected = false;
    }

    GetOptions();

    this.sendRestRequest = function (requestName, method, path, body) {

      if (!_host || !_port || !_icUsername || !_icPassword) {
        throw new Error('setEnvironment first!');
      }

      if (!requestName) {
        throw new Error('Missing required parameter: requestName');
      }
      if (!method) {
        throw new Error('Missing required parameter: method');
      }
      if (!path) {
        throw new Error('Missing required parameter: path');
      }

      var tmp_url = '';

      if (_icUseSsl) {
        tmp_url = 'https://';
      } else {
        tmp_url = 'http://';
      }

      tmp_url = tmp_url + _host + ':' + _port + '/';

      if (_sessionId) {
        tmp_url = tmp_url + 'icws/' + _sessionId + path;
      } else {
        tmp_url = tmp_url + 'icws/' + path;
      }

      var config = {
        method: method,
        url: tmp_url,
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'ININ-ICWS-CSRF-Token': _accessToken
        },
      };

      if (body) {
        config.data = JSON.stringify(body);
      }

      $log.debug('CIC Begin Request: [' + requestName + '] -> ' + tmp_url);
      var request = $http(config);

      request.then(function successCallback(response) {
        $log.debug('CIC End Request: [' + requestName + ']' + JSON.stringify(response));
      }, function errorCallback(response) {
        $log.error('CIC Request: [' + requestName + ']: ' + JSON.stringify(response));
      });

      return request;
    };

    this.Login = function () {
      _isConnected = false;
      _StatisticsJSON = '';

      var jSON_Object = {
        '__type': 'urn:inin.com:connection:icAuthConnectionRequestSettings',
        'applicationName': 'AnalyticsHub',
        'userID': _icUsername,
        'password': _icPassword
      };

      var deferred = $q.defer();
      try {
        this.sendRestRequest('CIC Login', 'POST', 'connection', jSON_Object).then(function success(response) {

          if (response.data.hasOwnProperty('sessionId')) {
            _isConnected = true;
            _sessionId = response.data.sessionId;
            _accessToken = response.data.csrfToken;
            deferred.resolve();
          }
          deferred.reject();
        }, function error() {
          _isConnected = false;
          deferred.reject();
        });
      }
      catch (e) {
        deferred.reject();
      }
      return deferred.promise;
    };

    this.Logoff = function () {

      var deferred = $q.defer();
      try {
        this.sendRestRequest('CIC Logoff', 'DELETE', '/connection').then(function success() {
          clearSession();
          deferred.resolve();
        }, function error() {
          clearSession();
          deferred.reject();
        });
      }
      catch (e) {
        deferred.reject();
      }
      return deferred.promise;

    };

    this.ShouldReconnect = function () {

      var deferred = $q.defer();
      try {
        this.sendRestRequest('CIC CheckConnection', 'GET', '/connection').then(function success(response) {
          if (response.data.hasOwnProperty('shouldReconnect')) {
            if (response.data.shouldReconnect) {
              clearSession();
              $log.debug('CIC Should reconnect: true');
              deferred.resolve(true);
            } else {
              $log.debug('CIC Should reconnect: false');
              deferred.resolve(false);
            }
          }
          $log.debug('CIC Should reconnect: false');
          deferred.resolve(false);
        }, function error() {
          clearSession();
          $log.debug('CIC Should reconnect: true');
          deferred.reject(true);
        });
      }
      catch (e) {
        deferred.reject(true);
      }
      return deferred.promise;
    };


    this.GetVersion = function () {
      var deferred = $q.defer();
      try {
        this.sendRestRequest('CIC GetVersion', 'GET', 'connection/version').then(function success(response) {
          deferred.resolve({ 'productPatchDisplayString': response.data.productPatchDisplayString });
        }, function error() {
          deferred.reject();
        });
      }
      catch (e) {
        deferred.reject();
      }
      return deferred.promise;
    };

    this.GetWorkgroups = function () {
      var jSON_Object = {
        'parameterTypeId': 'ININ.People.WorkgroupStats:Workgroup'
      };

      this.sendRestRequest('CIC GetWorkgroups', 'POST', '/statistics/statistic-parameter-values/queries', jSON_Object).then(function success(response) {
        $log.debug(response);
      }, function error() {

      });
    };

    function updateCache(input) {
      for (var y = 0; y < input.data[0].statisticValueChanges.length; y++) {
        var myObj = input.data[0].statisticValueChanges[y];
        $log.debug('Begin: ----')
        console.debug(myObj);

        var sWorkgroupName = myObj.statisticKey.parameterValueItems[0].value;
        var sStatName = myObj.statisticKey.statisticIdentifier;
        var sNewValue;

        if (myObj.statisticValue != null && myObj.statisticValue.value != null) {
          $log.debug('Got a value');
          sNewValue = myObj.statisticValue.value;

          $log.debug(sWorkgroupName);
          $log.debug(sStatName);
          $log.debug(sNewValue);

        } else {
          $log.debug('NULL value');
          sNewValue = null;
        }


        for (var i = 0; i < _StatisticsJSON.length; i++) {
          if ((_StatisticsJSON[i].statisticKey.statisticIdentifier === sStatName) &&
            (_StatisticsJSON[i].statisticKey.parameterValueItems[0].value === sWorkgroupName)) {

            // If we've received NULL, update NULL in a Cache
            if (sNewValue == null) {
              $log.debug('Updated NULL value in a Cache');
              _StatisticsJSON[i] = myObj;
              continue;
            }

            if (_StatisticsJSON[i].statisticValue != null && _StatisticsJSON[i].statisticValue.value != null) {
              _StatisticsJSON[i].statisticValue.value = myObj.statisticValue.value;
              $log.debug('Stat updated');
            } else {
              $log.debug('Field not defined / replace it !!');
              _StatisticsJSON[i] = myObj;
            }
          }
        }
        $log.debug('End:')
      }
      $log.debug('UpToDate Cached JSON Obj');
      var outputStat = jsonTranslator.translateCicStatSet(_StatisticsJSON);
      $log.debug(outputStat);
      powerbiService.SendToPowerBI('CIC', 'Workgroup', outputStat);


    };

    this.GetMessage = function () {

      var deferred = $q.defer();
      try {

        this.sendRestRequest('GetMessage', 'GET', '/messaging/messages').then(function success(response) {
          $log.debug(response);
          if ((response.data.length != 0) && (_StatisticsJSON.length == 0)) {
            // for (var i = 0; i < response.data.length; i++) {
            //   if (response.data[i].isDelta == false) {
            //     $log.debug('JSON Created');
            //     _StatisticsJSON = response.data[i].statisticValueChanges;
            //   }
            //   if ((_StatisticsJSON.length > 0) && (response.data[i].isDelta == true)) {
            //     $log.debug('JSON replaced');
            //     _StatisticsJSON = response.data[i].statisticValueChanges;
            //   }
            // }
            _StatisticsJSON = response.data[0].statisticValueChanges;



          } else
            if ((response.data.length != 0) && (_StatisticsJSON.length > 0)) {
              // Update local stats
              updateCache(response);
            }
          deferred.resolve();
        }, function error(response) {
          $log.debug(response);
          deferred.reject();
        });
      }
      catch (e) {
        deferred.reject();
      }
      return deferred.promise;

    };

    this.Subscribe = function (jSON_Object) {

      // Example JSON:

      var jSON_Object = {
        'isDelta': false,
        'statisticKeys':
        [
          {
            "statisticIdentifier": "inin.workgroup:AgentsLoggedIn",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "Marketing"
              }
            ]
          },
          {
            "statisticIdentifier": "inin.workgroup:TotalAgents",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "Marketing"
              }
            ]
          },
          {
            "statisticIdentifier": "inin.workgroup:TotalAgents",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "GroupA"
              }
            ]
          },
          {
            "statisticIdentifier": "inin.workgroup:PercentAvailable",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "Marketing"
              }
            ]
          },
          {
            "statisticIdentifier": "inin.workgroup:NumberAvailableForACDInteractions",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "Marketing"
              }
            ]
          },
          {
            "statisticIdentifier": "inin.workgroup:InteractionsWaiting",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "Marketing"
              }
            ]
          },
          {
            "statisticIdentifier": "inin.workgroup:InteractionsWaiting",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "GroupA"
              }
            ]
          }

          ,
          {
            "statisticIdentifier": "inin.workgroup:NotAvailable",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "Marketing"
              }
            ]
          },
          {
            "statisticIdentifier": "inin.workgroup:LongestAvailable",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "Marketing"
              }
            ]
          },
          {
            "statisticIdentifier": "inin.workgroup:OnInboundACDInteractions",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "Marketing"
              }
            ]
          },
          {
            "statisticIdentifier": "inin.workgroup:LongestInboundACDInteraction",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "Marketing"
              }
            ]
          },
          {
            "statisticIdentifier": "inin.workgroup:LongestOutboundACDInteraction",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "Marketing"
              }
            ]
          },

          {
            "statisticIdentifier": "inin.workgroup:LongestOnHoldTime",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "Marketing"
              }
            ]
          },
          {
            "statisticIdentifier": "inin.workgroup:LongestWaitTime",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "Marketing"
              }
            ]
          },
          {
            "statisticIdentifier": "inin.workgroup:InteractionsOnHold",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "Marketing"
              }
            ]
          },
          {
            "statisticIdentifier": "inin.workgroup:InteractionsEntered",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "Marketing"
              },
              {
                "parameterTypeId": "ININ.Queue:Interval",
                "value": "CurrentPeriod"
              }
            ]
          },
          {
            "statisticIdentifier": "inin.workgroup:InteractionsAnswered",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "Marketing"
              },
              {
                "parameterTypeId": "ININ.Queue:Interval",
                "value": "CurrentPeriod"
              }
            ]
          },
          {
            "statisticIdentifier": "inin.workgroup:InteractionsAbandoned",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "Marketing"
              },
              {
                "parameterTypeId": "ININ.Queue:Interval",
                "value": "CurrentPeriod"
              }
            ]
          },
          {
            "statisticIdentifier": "inin.workgroup:TotalTalkTime",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "Marketing"
              },
              {
                "parameterTypeId": "ININ.Queue:Interval",
                "value": "CurrentPeriod"
              }
            ]
          },
          {
            "statisticIdentifier": "inin.workgroup:AverageWaitTime",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "Marketing"
              },
              {
                "parameterTypeId": "ININ.Queue:Interval",
                "value": "CurrentPeriod"
              }
            ]
          },
          {
            "statisticIdentifier": "inin.workgroup:ServiceLevelTarget",
            "parameterValueItems":
            [
              {
                "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                "value": "Marketing"
              },
              {
                "parameterTypeId": "ININ.Queue:Interval",
                "value": "CurrentPeriod"
              },
              {
                "parameterTypeId": "ININ.Queue:InteractionType",
                "value": "Calls"
              }
            ]
          }

        ]
      };


      var deferred = $q.defer();
      try {
        this.sendRestRequest('Subscribe', 'PUT', '/messaging/subscriptions/statistics/statistic-values', jSON_Object).then(function success(response) {
          $log.debug(response);
          deferred.resolve();
        }, function error(response) {
          $log.debug(response);
          deferred.reject();
        });
      }
      catch (e) {
        deferred.reject();
      }
      return deferred.promise;

    };





  });