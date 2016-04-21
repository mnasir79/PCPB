'use strict';


angular.module('cicService', ['chromeStorage'])
  .service('cicService', function ($q, $http, $log, chromeStorage) {

    var _sessionId;
    var _accessToken;

    var _host;
    var _port;
    var _icUsername;
    var _icPassword;
    var _icUseSsl;

    var _isConnected = false;

    this.getIsConnected = function () {
      return _isConnected;
    };


    chromeStorage.get('icOptions').then(function (icOptions) {
      _host = icOptions.icIcServer;
      _port = icOptions.icPort;
      _icUsername = icOptions.icUsername;
      _icPassword = icOptions.icPassword;
      _icUseSsl = icOptions.icUseSsl;
    });



    this.sendRestRequest = function (requestName, method, path, body) {

      if (!_host) {
        throw new Error('setEnvironment first!');
      }
      if (!_port) {
        throw new Error('setEnvironment first!');
      }
      if (!_icUsername) {
        throw new Error('setEnvironment first!');
      }
      if (!_icPassword) {
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

      var tmp_url = "";

      if (_icUseSsl) {
        tmp_url = "https://";
      } else {
        tmp_url = "http://";
      }

      tmp_url = tmp_url + _host + ":" + _port + "/";

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

      $log.debug('Begin Request: ' + requestName);
      var request = $http(config);


      request.then(function successCallback(response) {
        $log.debug("Request success");
      }, function errorCallback(response) {
        $log.debug(response);
      });

      return request;
    };

    this.Login = function () {
      _isConnected = false;
      $log.debug(_host);

      var jSON_Object = {
        "__type": "urn:inin.com:connection:icAuthConnectionRequestSettings",
        "applicationName": "AnalyticsHub",
        "userID": _icUsername,
        "password": _icPassword
      }

      var deferred = $q.defer();

      this.sendRestRequest("Logon", "POST", "connection", jSON_Object).then(function success(response) {
        _isConnected = true;
        if (response.data.hasOwnProperty('sessionId')) {
          _sessionId = response.data.sessionId;
          _accessToken = response.data.csrfToken;
        }
        deferred.resolve();
      }, function error(response) {
        _isConnected = false;
        deferred.reject();
      });
      return deferred.promise;
    };

    this.Logoff = function (id) {
      $log.debug("Reset _sessionId and _accessToken variables");
      _sessionId = {};
      _accessToken = {};
      //$rootScope.isCICConnected = false;

    }

    this.GetVersion = function () {

      this.sendRestRequest("GetVersion", "GET", "connection/version").then(function success(response) {
        console.log(response.data);
        $scope.CICDescription = "[" + response.data.productPatchDisplayString + "]";

      }, function error(response) {
        console.log("Error");

      });
    }



  });