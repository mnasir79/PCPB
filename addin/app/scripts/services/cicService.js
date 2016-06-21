'use strict';


angular.module('cicService', ['chromeStorage'])
  .service('cicService', function ($q, $http, $log, chromeStorage) {

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

    this.getIsConnected = function () {
      return _isConnected;
    };

    // Load Enviroment Options from ChromeLocalStorage
    chromeStorage.get('icOptions').then(function (icOptions) {
      _host = icOptions.icIcServer;
      _port = icOptions.icPort;
      _icUsername = icOptions.icUsername;
      _icPassword = icOptions.icPassword;
      _icUseSsl = icOptions.icUseSsl;
    });

    function clearSession() {
      _sessionId = undefined;
      _accessToken = undefined;
      _isConnected = false;
    }

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


    this.GetMessage = function () {

      var deferred = $q.defer();
      try {

        this.sendRestRequest('GetMessage', 'GET', '/messaging/messages').then(function success(response) {
          $log.debug(response.data);
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
                "value": "120"
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
                "value": "120"
              }
            ]
          }
        ]
      }


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